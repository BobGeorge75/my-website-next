'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './Nav.module.css'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setIsOpen(false)

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
