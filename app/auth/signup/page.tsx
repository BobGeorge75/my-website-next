'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from './signup.module.css'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const origin = window.location.origin

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
    } else if (data.session) {
      // Email confirmation is disabled — session is active immediately
      router.push('/auth/pending')
    } else {
      // Email confirmation is enabled — show check-your-email screen
      setSent(true)
    }
  }

  if (sent) {
    return (
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.h1}>Check your email</h1>
          <p className={styles.desc}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to verify your account — you&apos;ll then be placed in a queue for approval by a Committee Member.
          </p>
          <Link href="/auth/login" className={styles.link}>Back to login</Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <p className={styles.label}>Members Area</p>
        <h1 className={styles.h1}>Create an account</h1>
        <p className={styles.desc}>Sign up for access. A Committee Member will approve your request.</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link href="/auth/login" className={styles.link}>Log in</Link>
        </p>
      </div>
    </main>
  )
}
