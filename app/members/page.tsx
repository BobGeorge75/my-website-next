import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './members.module.css'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export const dynamic = 'force-dynamic'

interface Document {
  id: number
  name: string
  description: string | null
  file_path: string
  created_at: string
}

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role === 'pending') redirect('/auth/pending')

  const { data: documents } = await supabase
    .from('documents')
    .select('id, name, description, file_path, created_at')
    .order('created_at', { ascending: false })

  // Generate signed URLs for each document
  const docsWithUrls = await Promise.all(
    (documents ?? []).map(async (doc: Document) => {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_path, 3600)
      return { ...doc, signedUrl: data?.signedUrl ?? null }
    })
  )

  const firstName = profile.full_name?.split(' ')[0] ?? 'Member'
  const isAdmin = profile.role === 'Admin'

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div>
          <p className={styles.label}>Members Area</p>
          <h1 className={styles.h1}>Welcome, {firstName}</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={isAdmin ? styles.badgeCommittee : styles.badgeMember}>
            {isAdmin ? 'Admin' : 'Member'}
          </span>
          {isAdmin && (
            <Link href="/members/admin" className={styles.adminLink}>
              Admin panel →
            </Link>
          )}
          <form action={signOut}>
            <button type="submit" className={styles.signOutBtn}>Sign out</button>
          </form>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Documents</h2>

        {docsWithUrls.length === 0 ? (
          <div className={styles.empty}>
            <p>No documents have been uploaded yet.</p>
            {isAdmin && (
              <Link href="/members/admin" className={styles.emptyLink}>
                Upload the first document →
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {docsWithUrls.map(doc => (
              <div key={doc.id} className={styles.card}>
                <div className={styles.cardIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{doc.name}</h3>
                  {doc.description && (
                    <p className={styles.cardDesc}>{doc.description}</p>
                  )}
                  <p className={styles.cardDate}>
                    {new Date(doc.created_at).toLocaleDateString('en-AU', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                {doc.signedUrl && (
                  <a
                    href={doc.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadBtn}
                    download
                  >
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
