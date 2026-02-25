import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import Link from 'next/link'
import UploadForm from './UploadForm'
import styles from './admin.module.css'

export const dynamic = 'force-dynamic'

// ── Server Actions ──────────────────────────────────────────────────────────

async function approveUser(formData: FormData) {
  'use server'
  const userId = formData.get('userId') as string
  if (!userId) return

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  await adminClient.from('profiles').update({ role: 'member' }).eq('id', userId)
  revalidatePath('/members/admin')
}

async function deleteUser(formData: FormData) {
  'use server'
  const userId = formData.get('userId') as string
  if (!userId) return

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  await adminClient.auth.admin.deleteUser(userId)
  revalidatePath('/members/admin')
}

async function deleteDocument(formData: FormData) {
  'use server'
  const docId = formData.get('docId') as string
  const filePath = formData.get('filePath') as string
  if (!docId || !filePath) return

  const supabase = await createClient()
  await supabase.from('documents').delete().eq('id', docId)
  await supabase.storage.from('documents').remove([filePath])
  revalidatePath('/members/admin')
}

// ── Page ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  role: string
}

interface Document {
  id: number
  name: string
  description: string | null
  file_path: string
  created_at: string
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Admin') redirect('/members')

  const [{ data: pendingUsers }, { data: documents }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, full_name, created_at, role')
      .eq('role', 'pending')
      .order('created_at', { ascending: true }),
    supabase
      .from('documents')
      .select('id, name, description, file_path, created_at')
      .order('created_at', { ascending: false }),
  ])

  return (
    <main className={styles.main}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.label}>Committee</p>
          <h1 className={styles.h1}>Admin Panel</h1>
        </div>
        <Link href="/members" className={styles.backLink}>
          ← Members area
        </Link>
      </div>

      {/* ── Pending Members ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Pending Members
          {(pendingUsers?.length ?? 0) > 0 && (
            <span className={styles.badge}>{pendingUsers!.length}</span>
          )}
        </h2>

        {!pendingUsers || pendingUsers.length === 0 ? (
          <div className={styles.empty}>No pending members — you&apos;re all caught up.</div>
        ) : (
          <div className={styles.table}>
            {(pendingUsers as Profile[]).map(u => (
              <div key={u.id} className={styles.tableRow}>
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{u.full_name ?? '—'}</p>
                  <p className={styles.userEmail}>{u.email}</p>
                  <p className={styles.userDate}>
                    Signed up {new Date(u.created_at).toLocaleDateString('en-AU', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <div className={styles.actions}>
                  <form action={approveUser}>
                    <input type="hidden" name="userId" value={u.id} />
                    <button type="submit" className={styles.btnApprove}>Approve</button>
                  </form>
                  <form action={deleteUser}>
                    <input type="hidden" name="userId" value={u.id} />
                    <button type="submit" className={styles.btnDelete}>Delete</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Document Management ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Documents</h2>

        <UploadForm />

        <div className={styles.docList}>
          {!documents || documents.length === 0 ? (
            <div className={styles.empty}>No documents uploaded yet.</div>
          ) : (
            (documents as Document[]).map(doc => (
              <div key={doc.id} className={styles.docRow}>
                <div className={styles.docInfo}>
                  <p className={styles.docName}>{doc.name}</p>
                  {doc.description && (
                    <p className={styles.docDesc}>{doc.description}</p>
                  )}
                  <p className={styles.docDate}>
                    {new Date(doc.created_at).toLocaleDateString('en-AU', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <form action={deleteDocument}>
                  <input type="hidden" name="docId" value={doc.id} />
                  <input type="hidden" name="filePath" value={doc.file_path} />
                  <button type="submit" className={styles.btnDelete}>Delete</button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
