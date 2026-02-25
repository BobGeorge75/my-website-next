'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './Nav.module.css'

type Role = 'pending' | 'member' | 'committee' | null

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState<Role>(null)
  const [firstName, setFirstName] = useState<string>('')
  const pathname = usePathname()
  const router = useRouter()

  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    const supabase = createClient()

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', userId)
        .single()
      if (data) {
        setRole(data.role as Role)
        setFirstName(data.full_name?.split(' ')[0] ?? '')
      }
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user.id)
      else setRole(null)
    })

    // Keep in sync with auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setRole(null)
        setFirstName('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>DP</Link>

      <ul className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
        <li>
          <Link href="/#about" className={styles.link} onClick={closeMenu}>About</Link>
        </li>
        <li>
          <Link
            href="/about"
            className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`}
            onClick={closeMenu}
          >
            My Story
          </Link>
        </li>
        <li>
          <Link
            href="/journey"
            className={`${styles.link} ${pathname === '/journey' ? styles.active : ''}`}
            onClick={closeMenu}
          >
            Journey
          </Link>
        </li>
        <li>
          <Link href="/#contact" className={styles.link} onClick={closeMenu}>Contact</Link>
        </li>

        {/* Auth-aware items */}
        {role === null && (
          <li>
            <Link
              href="/auth/login"
              className={`${styles.link} ${pathname === '/auth/login' ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Login
            </Link>
          </li>
        )}

        {role === 'pending' && (
          <>
            <li>
              <span className={styles.badgePending}>Pending</span>
            </li>
            <li>
              <button className={styles.signOutBtn} onClick={() => { closeMenu(); handleSignOut() }}>
                Sign out
              </button>
            </li>
          </>
        )}

        {(role === 'member' || role === 'committee') && (
          <>
            <li>
              <Link
                href="/members"
                className={`${styles.link} ${pathname?.startsWith('/members') ? styles.active : ''}`}
                onClick={closeMenu}
              >
                Members
              </Link>
            </li>
            <li>
              <span className={role === 'committee' ? styles.badgeCommittee : styles.badgeMember}>
                {firstName || (role === 'committee' ? 'Committee' : 'Member')}
              </span>
            </li>
            <li>
              <button className={styles.signOutBtn} onClick={() => { closeMenu(); handleSignOut() }}>
                Sign out
              </button>
            </li>
          </>
        )}
      </ul>

      <button
        className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}
