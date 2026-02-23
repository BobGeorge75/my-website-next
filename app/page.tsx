import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/Button/Button'
import styles from './home.module.css'

export const metadata: Metadata = {
  title: 'Daniel Pratt',
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero} id="hero">
        <div className={styles.badge}>Entrepreneur &middot; Brisbane, Australia</div>
        <h1 className={styles.h1}>
          Hi, I&apos;m<br />
          <span className={styles.h1Gradient}>Daniel Pratt.</span>
        </h1>
        <p className={styles.heroDesc}>
          Building businesses from the ground up in Brisbane, Australia. Passionate about ideas that create real impact.
        </p>
        <div className={styles.ctaGroup}>
          <Button href="/#about" variant="primary">Learn more</Button>
          <Button href="/#contact" variant="ghost">Get in touch</Button>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* About */}
      <section className={styles.section} id="about">
        <p className={styles.sectionLabel}>About me</p>
        <h2 className={styles.h2}>A bit about myself</h2>
        <div className={styles.bioText}>
          <p>
            I&apos;m an entrepreneur based in Brisbane, Australia. I&apos;m driven by the challenge of turning ideas into ventures that matter &mdash; building teams, solving real problems, and creating lasting value.
          </p>
          <p>
            Brisbane is a city on the rise, and I&apos;m proud to be part of its growing business community. Whether it&apos;s a new venture or a bold opportunity, I bring energy, focus, and a bias for action to everything I do.
          </p>
        </div>
        <div className={styles.skills}>
          <span className={styles.skillChip}>Entrepreneurship</span>
          <span className={styles.skillChip}>Strategy</span>
          <span className={styles.skillChip}>Leadership</span>
          <span className={styles.skillChip}>Business Development</span>
          <span className={styles.skillChip}>Innovation</span>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* Contact */}
      <section className={styles.section} id="contact">
        <p className={styles.sectionLabel}>Contact</p>
        <h2 className={styles.h2}>Let&apos;s connect</h2>
        <div className={styles.contactCard}>
          <p>
            Have a question, an opportunity, or just want to say hello? My inbox is open. I&apos;ll do my best to get back to you.
          </p>
          <a href="mailto:hello@bobgeorge.com" className={styles.contactLink}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            hello@bobgeorge.com
          </a>
          <div className={styles.contactButtons}>
            <Button href="mailto:hello@bobgeorge.com" variant="primary">Send an email</Button>
            <Button href="/feedback" variant="pink">Feedback</Button>
          </div>
        </div>
      </section>
    </>
  )
}
