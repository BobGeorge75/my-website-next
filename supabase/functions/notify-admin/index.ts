// Supabase Edge Function: notify-admin
// Triggered by a Database Webhook when a new row is inserted into public.profiles
//
// Setup:
//   1. Deploy: supabase functions deploy notify-admin
//   2. Set secrets:
//        supabase secrets set ADMIN_EMAIL=your-admin@example.com
//        supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
//   3. Create a Database Webhook in the Supabase Dashboard:
//        Table: public.profiles  |  Event: INSERT
//        HTTP endpoint: https://<your-project-ref>.supabase.co/functions/v1/notify-admin
//        (Add header: Authorization: Bearer <your-anon-key>)
//
// This function uses Resend (https://resend.com) — Supabase's recommended
// email partner with a built-in integration in the Supabase dashboard.
// Configure the integration at: Dashboard → Integrations → Resend

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  record: Record<string, unknown>
  old_record: Record<string, unknown> | null
}

Deno.serve(async (req) => {
  console.log('[notify-admin] Function invoked:', req.method, req.url)

  // Log all incoming headers (helps verify the webhook Authorization header)
  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => { headers[key] = value })
  console.log('[notify-admin] Request headers:', JSON.stringify(headers))

  // Only accept POST from the Supabase webhook
  if (req.method !== 'POST') {
    console.log('[notify-admin] Rejected: wrong method', req.method)
    return new Response('Method not allowed', { status: 405 })
  }

  // Log raw body before parsing so we can see exactly what the webhook sends
  const rawBody = await req.text()
  console.log('[notify-admin] Raw body:', rawBody)

  let payload: WebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch (err) {
    console.error('[notify-admin] Failed to parse JSON body:', err)
    return new Response('Invalid JSON', { status: 400 })
  }

  console.log('[notify-admin] Parsed payload type:', payload.type)
  console.log('[notify-admin] Parsed payload table:', payload.schema, payload.table)
  console.log('[notify-admin] Record keys:', Object.keys(payload.record ?? {}))
  console.log('[notify-admin] Full record:', JSON.stringify(payload.record))

  const record = payload.record
  const role = record.role as string | undefined

  // Only notify for new pending sign-ups
  if (role !== 'pending') {
    console.log('[notify-admin] Skipping: role is', role, '(expected "pending")')
    return new Response('Not a pending signup — skipping.', { status: 200 })
  }

  // email may not be a column on public.profiles — it lives on auth.users.
  // We fall back to looking it up via the service role client if missing.
  let email = record.email as string | undefined
  const full_name = record.full_name as string | null | undefined
  const created_at = record.created_at as string | undefined
  const userId = record.id as string | undefined

  console.log('[notify-admin] email from record:', email)
  console.log('[notify-admin] full_name from record:', full_name)
  console.log('[notify-admin] userId:', userId)

  const adminEmail = Deno.env.get('ADMIN_EMAIL')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')

  if (!adminEmail || !resendApiKey) {
    console.error('[notify-admin] Missing ADMIN_EMAIL or RESEND_API_KEY secret.')
    return new Response('Configuration error', { status: 500 })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // If email isn't on the profiles row, fetch it from auth.users
  if (!email && userId) {
    console.log('[notify-admin] email not on profiles row — fetching from auth.users')
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)
    if (authError) {
      console.error('[notify-admin] Failed to fetch auth user:', authError.message)
    } else {
      email = authUser.user?.email
      console.log('[notify-admin] email from auth.users:', email)
    }
  }

  if (!email) {
    console.error('[notify-admin] No email found — cannot send notification.')
    return new Response('No email found', { status: 500 })
  }

  // Confirm committee member count (for informational purposes)
  const { count, error: countError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'committee')

  if (countError) {
    console.error('[notify-admin] Error fetching committee count:', countError.message)
  }
  console.log('[notify-admin] Committee count:', count)

  const signedUpAt = created_at
    ? new Date(created_at).toLocaleString('en-AU', {
        timeZone: 'Australia/Brisbane',
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'unknown'

  const emailBody = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; background: #f5f5f5; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 2rem; border: 1px solid #e0e0e0;">
    <h2 style="margin-top: 0; color: #111;">New member sign-up</h2>
    <p style="color: #444;">A new member has signed up and is awaiting your approval.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 1.25rem 0;">
      <tr>
        <td style="padding: 0.5rem 0; color: #666; font-size: 0.9rem; width: 120px;">Name</td>
        <td style="padding: 0.5rem 0; font-weight: 600;">${full_name ?? '—'}</td>
      </tr>
      <tr>
        <td style="padding: 0.5rem 0; color: #666; font-size: 0.9rem;">Email</td>
        <td style="padding: 0.5rem 0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 0.5rem 0; color: #666; font-size: 0.9rem;">Signed up</td>
        <td style="padding: 0.5rem 0;">${signedUpAt} AEST</td>
      </tr>
      <tr>
        <td style="padding: 0.5rem 0; color: #666; font-size: 0.9rem;">Committee</td>
        <td style="padding: 0.5rem 0;">${count ?? 0} member(s)</td>
      </tr>
    </table>
    <a href="https://danielpratt.com.au/members/admin" style="display: inline-block; background: #c9a84c; color: #fff; text-decoration: none; border-radius: 8px; padding: 0.65rem 1.5rem; font-weight: 700; font-size: 0.95rem;">
      Review in Admin Panel
    </a>
    <p style="margin-top: 1.5rem; color: #999; font-size: 0.8rem;">
      You are receiving this because you are a Committee Member. Log in to approve or reject this request.
    </p>
  </div>
</body>
</html>
`.trim()

  console.log('[notify-admin] Sending email to:', adminEmail)

  // Send via Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Members System <onboarding@resend.dev>',
      to: adminEmail,
      subject: `New member sign-up: ${full_name ?? email}`,
      html: emailBody,
    }),
  })

  const resendBody = await res.text()
  console.log('[notify-admin] Resend status:', res.status)
  console.log('[notify-admin] Resend response:', resendBody)

  if (!res.ok) {
    console.error('[notify-admin] Resend error:', resendBody)
    return new Response('Email send failed', { status: 500 })
  }

  console.log('[notify-admin] Notification sent successfully.')
  return new Response('Notification sent.', { status: 200 })
})
