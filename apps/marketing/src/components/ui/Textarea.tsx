import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full bg-inset border border-line p-3 text-sm focus:border-gold focus:outline-hidden transition-colors text-ink resize-none ${className}`}
      {...props}
    />
  )
}
