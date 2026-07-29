import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full bg-inset border border-line p-[13px] text-sm focus:border-gold focus:outline-hidden transition-colors text-ink ${className}`}
      {...props}
    />
  )
}
