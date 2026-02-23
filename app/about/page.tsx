import type { Metadata } from 'next'
import Button from '@/components/Button/Button'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'About – Daniel Pratt',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>My Story</div>
        <h1 className={styles.h1}>
          The person<br />behind <span className={styles.h1Gradient}>the work.</span>
        </h1>
        <p className={styles.heroDesc}>
          Entrepreneur, builder, and lifelong learner. Here&apos;s a bit more about where I came from, what drives me, and what I&apos;m working on right now.
        </p>
      </section>

      <hr className={styles.divider} />

      {/* Background */}
      <section className={styles.section} id="background">
        <p className={styles.sectionLabel}>Background</p>
        <h2 className={styles.h2}>Where I come from</h2>
        <div className={styles.bioText}>
          <p>
            I grew up with a natural curiosity for how things work &mdash; not just machines or systems, but people, markets, and ideas. That curiosity eventually led me to entrepreneurship, where every day is a chance to build something from nothing.
          </p>
          <p>
            Based in Brisbane, I&apos;ve been fortunate to work across a range of industries, tackling the kinds of problems that don&apos;t have easy answers. I thrive in the early stages of a business &mdash; finding the opportunity, forming the right team, and putting the pieces together under pressure.
          </p>
          <p>
            Outside of work I&apos;m a firm believer that the habits you build in your personal life carry over into the professional. Discipline, consistency, and a willingness to be a beginner again &mdash; these matter more than any single skill.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>Brisbane</span>
            <span className={styles.statLabel}>Home base</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>10+</span>
            <span className={styles.statLabel}>Years in business</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>Builder</span>
            <span className={styles.statLabel}>At heart</span>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* Skills */}
      <section className={styles.section} id="skills">
        <p className={styles.sectionLabel}>Skills</p>
        <h2 className={styles.h2}>What I bring to the table</h2>
        <div className={styles.skillsGrid}>
          <div className={styles.skillCard}>
            <div className={styles.skillIcon}>🏗️</div>
            <h3>Business Building</h3>
            <p>From idea validation to launch and scale &mdash; I&apos;ve navigated the full lifecycle of building ventures from the ground up.</p>
          </div>
          <div className={styles.skillCard}>
            <div className={styles.skillIcon}>🧭</div>
            <h3>Strategy &amp; Vision</h3>
            <p>Cutting through noise to identify what actually matters and setting a clear direction that a team can rally around.</p>
          </div>
          <div className={styles.skillCard}>
            <div className={styles.skillIcon}>🤝</div>
            <h3>Leadership</h3>
            <p>Building trust, creating accountability, and getting the best out of people &mdash; especially in fast-moving environments.</p>
          </div>
          <div className={styles.skillCard}>
            <div className={styles.skillIcon}>📈</div>
            <h3>Business Development</h3>
            <p>Identifying and closing opportunities, forging partnerships, and opening new markets through relationships and hustle.</p>
          </div>
          <div className={styles.skillCard}>
            <div className={styles.skillIcon}>💡</div>
            <h3>Innovation</h3>
            <p>Finding unconventional solutions to conventional problems &mdash; and knowing when to zig while others zag.</p>
          </div>
          <div className={styles.skillCard}>
            <div className={styles.skillIcon}>💻</div>
            <h3>Technology (Learning)</h3>
            <p>Actively building literacy in code and digital tools so I can work closer to the product and understand what I&apos;m building.</p>
          </div>
        </div>
        <div className={styles.chips}>
          <span className={styles.chip}>Entrepreneurship</span>
          <span className={styles.chip}>Strategy</span>
          <span className={styles.chip}>Leadership</span>
          <span className={styles.chip}>Business Development</span>
          <span className={styles.chip}>Innovation</span>
          <span className={styles.chip}>Negotiation</span>
          <span className={styles.chip}>Team Building</span>
          <span className={styles.chip}>HTML &amp; CSS</span>
          <span className={styles.chip}>Problem Solving</span>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* Coding Journey */}
      <section className={styles.section} id="coding">
        <p className={styles.sectionLabel}>Learning to Code</p>
        <h2 className={styles.h2}>My journey into tech</h2>
        <div className={styles.bioText} style={{ marginBottom: '2.5rem' }}>
          <p>
            For most of my career, technology was something I delegated &mdash; I knew enough to ask the right questions, but I wasn&apos;t close to the craft. That changed when I decided that if I was going to build things in the modern world, I needed to understand the tools that power them.
          </p>
        </div>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>The spark</div>
            <div className={styles.timelineLine}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineConnector} />
            </div>
            <div className={styles.timelineBody}>
              <h3>Deciding to learn</h3>
              <p>Frustrated by always depending on developers to bring ideas to life, I made the decision to start learning to code. Not to become a full-stack engineer &mdash; but to close the gap between idea and execution.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>First steps</div>
            <div className={styles.timelineLine}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineConnector} />
            </div>
            <div className={styles.timelineBody}>
              <h3>HTML &amp; CSS basics</h3>
              <p>I started where most people do &mdash; HTML and CSS. Building static pages, understanding how the web is structured, and slowly getting comfortable with the idea that code is just logic you can read and write.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>Building</div>
            <div className={styles.timelineLine}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineConnector} />
            </div>
            <div className={styles.timelineBody}>
              <h3>This website</h3>
              <p>This site is a milestone &mdash; the first real thing I&apos;ve built and shipped myself. Every section, every button, every line of CSS is a reminder of how far the journey has come and how much further there is to go.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>Next</div>
            <div className={styles.timelineLine}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineConnector} />
            </div>
            <div className={styles.timelineBody}>
              <h3>What&apos;s ahead</h3>
              <p>JavaScript, building interactive products, and eventually understanding how to connect the front end to real data. The goal isn&apos;t to replace engineers &mdash; it&apos;s to become a founder who can build a meaningful prototype and speak the language of the craft.</p>
            </div>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* CTA */}
      <section className={`${styles.section} ${styles.ctaSection}`} id="cta">
        <p className={styles.sectionLabel}>Get in touch</p>
        <h2 className={styles.h2}>Want to connect?</h2>
        <p className={styles.ctaDesc}>
          Whether you have an idea, an opportunity, or just want to compare notes &mdash; I&apos;m always open to a good conversation.
        </p>
        <div className={styles.ctaRow}>
          <Button href="/#contact" variant="primary">Get in touch</Button>
          <Button href="/" variant="ghost">Back to home</Button>
        </div>
      </section>
    </>
  )
}
