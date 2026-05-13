import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full bg-inset border border-line p-3 text-sm focus:border-gold focus:outline-hidden transition-colors text-ink autofill:bg-neutral-900 ${className}`}
      {...props}
    />
  )
}
