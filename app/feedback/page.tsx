'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './feedback.module.css'

export default function FeedbackPage() {
  const [charCount, setCharCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className={styles.main}>
      <Link href="/" className={styles.backLink}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </Link>

      <p className={styles.sectionLabel}>Feedback</p>
      <h1 className={styles.h1}>Share your thoughts</h1>
      <p className={styles.pageDesc}>I&apos;d love to hear from you. Fill in the form below and I&apos;ll get back to you.</p>

      <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Your name" required />
        </div>

        <div className={styles.field}>
          <label htmlFor="mobile">Mobile</label>
          <input type="tel" id="mobile" name="mobile" placeholder="+61 4xx xxx xxx" required />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="you@example.com" required />
        </div>

        <div className={styles.field}>
          <label htmlFor="message">
            Message <span>(max 24 characters)</span>
          </label>
          <textarea
            id="message"
            name="message"
            maxLength={24}
            placeholder="Your message…"
            rows={3}
            required
            onChange={(e) => setCharCount(e.target.value.length)}
          />
          <span className={`${styles.charCount} ${charCount >= 24 ? styles.over : ''}`}>
            {charCount} / 24
          </span>
        </div>

        {submitted && (
          <div className={styles.successMsg}>
            Thanks for your feedback! I&apos;ll be in touch soon.
          </div>
        )}

        <button type="submit" className={styles.btnSubmit} disabled={submitted}>
          {submitted ? 'Sent!' : 'Send Feedback'}
        </button>
      </form>
    </main>
  )
}
