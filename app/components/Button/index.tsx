import React from 'react'
import styles from './index.module.css'

export const Button = ({
  children,
  variant = 'primary',
  onClick,
  disabled,
  ...props
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'text'
  onClick?: () => void
  disabled?: boolean
  props?: React.ComponentProps<'button'>
}) => {
  return (
    <button className={styles[variant]} {...props} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
