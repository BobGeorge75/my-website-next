import Link from 'next/link'
import styles from './Button.module.css'

type Variant = 'primary' | 'ghost' | 'pink'

interface ButtonProps {
  variant?: Variant
  href?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  href,
  children,
  onClick,
  disabled,
  type = 'button',
}: ButtonProps) {
  const className = `${styles.btn} ${styles[variant]}`

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}
