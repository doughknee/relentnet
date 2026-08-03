import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  fullWidth?: boolean
}

export function Button({
  className = '',
  variant = 'primary',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'chromatic-hover uppercase tracking-[0.15em] transition-all duration-300'

  const variants = {
    primary:
      'bg-gold border border-gold text-gold-ink font-medium text-xs py-[17px] px-8 cursor-pointer hover:bg-transparent hover:text-gold-text disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'border border-line px-6 py-3 text-xs text-ink cursor-pointer hover:border-gold hover:text-gold-text',
  }

  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
