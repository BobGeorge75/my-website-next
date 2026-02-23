import type { Metadata } from 'next'
import styles from './journey.module.css'

export const metadata: Metadata = {
  title: 'Journey – Daniel Pratt',
}

const milestones = [
  {
    date: 'Early 2025',
    tag: 'Environment',
    tagClass: 'tagEnv',
    title: 'Set up Mac development environment',
    desc: 'The first real step: getting the machine ready. Installed Homebrew — the missing package manager for macOS — then used it to install Node.js. A dev environment that would have felt foreign a few months earlier suddenly felt like home base.',
    chips: ['Homebrew', 'Node.js', 'Terminal', 'macOS'],
    delay: '0.05s',
  },
  {
    date: '2025',
    tag: 'Tools',
    tagClass: 'tagTools',
    title: 'Installed Claude Code',
    desc: 'Discovered and installed Claude Code — an AI-powered CLI that sits right in the terminal. A game-changer for someone learning to code: a collaborator who never gets frustrated, explains everything, and writes alongside you. Having this tool made the steep parts of the learning curve dramatically more approachable.',
    chips: ['Claude Code', 'CLI', 'AI-assisted coding'],
    delay: '0.15s',
  },
  {
    date: '2025',
    tag: 'HTML',
    tagClass: 'tagCode',
    title: 'Built my first webpage with HTML',
    desc: null,
    descJsx: true,
    chips: ['HTML', 'CSS', 'Browser DevTools'],
    delay: '0.25s',
  },
  {
    date: '2025',
    tag: 'Project',
    tagClass: 'tagProject',
    title: 'Built a multi-page personal website with a modern design',
    desc: 'Went from a single HTML file to a complete, multi-page personal site with a consistent design system — navigation, colour palette, typography, components, responsive layout, and multiple linked pages. This site is the proof. Every pixel is a lesson learned.',
    chips: ['CSS Variables', 'Responsive Design', 'Multi-page site', 'Design Systems', 'Forms', 'Navigation'],
    delay: '0.35s',
  },
  {
    date: '2026',
    tag: 'Git',
    tagClass: 'tagProject',
    title: 'Pushed my website to GitHub for the first time',
    desc: 'Set up a GitHub repository, configured git with my name and email, and pushed my code to the cloud for the first time. Version control went from being an abstract concept to something I actually use — every commit is now a permanent record of progress.',
    chips: ['Git', 'GitHub', 'GitHub CLI', 'Version Control'],
    delay: '0.45s',
  },
  {
    date: '2026',
    tag: 'Deploy',
    tagClass: 'tagProject',
    title: 'Deployed my website live on the internet using Vercel',
    desc: 'Went from files sitting on a hard drive to a real, live website accessible to anyone in the world. Connecting GitHub to Vercel and watching the site go live was a genuine milestone — the moment a project stops being local and starts being real.',
    chips: ['Vercel', 'Deployment', 'DNS', 'Hosting'],
    delay: '0.55s',
  },
  {
    date: '2026',
    tag: 'JavaScript',
    tagClass: 'tagCode',
    title: 'Fixed mobile navigation with a hamburger menu',
    desc: 'The site looked great on desktop but the navigation just disappeared on mobile. Learned how to write JavaScript to make the hamburger icon toggle a dropdown menu — the first time I used JS to make something actually interactive on a page.',
    chips: ['JavaScript', 'DOM Events', 'Responsive Design', 'CSS Transitions'],
    delay: '0.65s',
  },
  {
    date: '2026',
    tag: 'Workflow',
    tagClass: 'tagTools',
    title: 'Learned to push code updates and see my live site update automatically',
    desc: null,
    descWorkflow: true,
    chips: ['CI/CD', 'git push', 'Vercel', 'Deployment Pipeline'],
    delay: '0.75s',
  },
]

export default function JourneyPage() {
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
            <div className={styles.statVal}>8</div>
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
          {milestones.map((m, i) => (
            <div
              key={i}
              className={styles.milestone}
              style={{ animationDelay: m.delay }}
            >
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneMeta}>
                  <span className={styles.milestoneDate}>{m.date}</span>
                  <span className={`${styles.milestoneTag} ${styles[m.tagClass as keyof typeof styles]}`}>{m.tag}</span>
                </div>
                <h3>{m.title}</h3>
                {m.descJsx ? (
                  <p>
                    The classic moment: opening a text editor, writing{' '}
                    <code className={styles.inlineCode}>&lt;!DOCTYPE html&gt;</code>
                    , and seeing something appear in a browser window. It was simple, it was rough &mdash; and it was mine. Understanding that a webpage is just a text file the browser reads changed how I see the whole web.
                  </p>
                ) : m.descWorkflow ? (
                  <p>
                    Discovered the power of a real deployment pipeline: make a change, commit, push to GitHub, and within seconds the live site updates. No manual uploading, no FTP &mdash; just{' '}
                    <code className={styles.inlineCode}>git push</code>
                    {' '}and it&apos;s live. This is how professionals ship.
                  </p>
                ) : (
                  <p>{m.desc}</p>
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
