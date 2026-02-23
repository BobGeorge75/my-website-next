import type { Metadata } from 'next'
import styles from './journey.module.css'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Journey – Daniel Pratt',
}

export const dynamic = 'force-dynamic'

interface Milestone {
  id: number
  order_index: number
  date: string
  tag: string
  tag_class: string
  title: string
  description: string | null
  content_type: string
  chips: string[]
}

export default async function JourneyPage() {
  const { data: milestones, error } = await supabase
    .from('milestones')
    .select('*')
    .order('order_index', { ascending: true })

  if (error || !milestones) {
    return (
      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p>Unable to load milestones right now. Please try again later.</p>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>In progress</div>
        <h1 className={styles.h1}>
          My coding<br />
          <span className={styles.h1Gradient}>journey.</span>
        </h1>
        <p className={styles.heroDesc}>
          Every expert was once a beginner. This is the honest, milestone-by-milestone record of how I&apos;m learning to build things on the web &mdash; starting from zero.
        </p>
      </section>

      <hr className={styles.divider} />

      {/* Timeline */}
      <section className={styles.timelineSection}>
        <p className={styles.sectionLabel}>Timeline</p>
        <h2 className={styles.h2}>Milestones so far</h2>
        <p className={styles.sectionIntro}>
          A living record of progress. Each milestone represents a real step forward &mdash; some small, some significant, all meaningful.
        </p>

        {/* Stats */}
        <div className={styles.statsBar}>
          <div className={styles.statPill}>
            <div className={styles.statVal}>11</div>
            <div className={styles.statLbl}>Milestones hit</div>
          </div>
          <div className={styles.statPill}>
            <div className={styles.statVal}>4</div>
            <div className={styles.statLbl}>Pages built</div>
          </div>
          <div className={styles.statPill}>
            <div className={styles.statVal}>∞</div>
            <div className={styles.statLbl}>Left to learn</div>
          </div>
        </div>

        {/* Track */}
        <div className={styles.tlTrack}>
          {milestones.map((m: Milestone, index: number) => (
            <div
              key={m.id}
              className={styles.milestone}
              style={{ animationDelay: `${(index * 0.1 + 0.05).toFixed(2)}s` }}
            >
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneMeta}>
                  <span className={styles.milestoneDate}>{m.date}</span>
                  <span className={`${styles.milestoneTag} ${styles[m.tag_class as keyof typeof styles]}`}>{m.tag}</span>
                </div>
                <h3>{m.title}</h3>
                {m.content_type === 'html_first' ? (
                  <p>
                    The classic moment: opening a text editor, writing{' '}
                    <code className={styles.inlineCode}>&lt;!DOCTYPE html&gt;</code>
                    , and seeing something appear in a browser window. It was simple, it was rough &mdash; and it was mine. Understanding that a webpage is just a text file the browser reads changed how I see the whole web.
                  </p>
                ) : m.content_type === 'workflow' ? (
                  <p>
                    Discovered the power of a real deployment pipeline: make a change, commit, push to GitHub, and within seconds the live site updates. No manual uploading, no FTP &mdash; just{' '}
                    <code className={styles.inlineCode}>git push</code>
                    {' '}and it&apos;s live. This is how professionals ship.
                  </p>
                ) : (
                  <p>{m.description}</p>
                )}
                <div className={styles.milestoneChips}>
                  {m.chips.map((chip) => (
                    <span key={chip} className={styles.mChip}>{chip}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Coming soon */}
          <div className={styles.comingSoon}>
            <div className={styles.comingSoonIcon}>🔭</div>
            <div>
              <strong>More milestones on the way</strong>
              JavaScript, interactive features, connecting to real data &mdash; the next chapters are being written right now.
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
