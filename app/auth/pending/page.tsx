import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './pending.module.css'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  // If somehow a non-pending user lands here, send them to members
  if (profile?.role && profile.role !== 'pending') {
    redirect('/members')
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.icon}>⏳</div>
        <p className={styles.label}>Account Pending</p>
        <h1 className={styles.h1}>Hi {firstName},</h1>
        <p className={styles.desc}>
          Your account has been created and is awaiting approval from a Committee Member. You&apos;ll receive access once approved.
        </p>
        <p className={styles.emailNote}>Signed in as <span>{user.email}</span></p>

        <form action={signOut}>
          <button type="submit" className={styles.btnSignOut}>
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
