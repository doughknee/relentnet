import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { effective, setChoice } = useTheme()

  function toggle() {
    setChoice(effective === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${effective === 'dark' ? 'light' : 'dark'} mode`}
      className="cursor-pointer p-2 text-ink transition-colors hover:text-gold-text"
    >
      {effective === 'dark' ? (
        <Sun className="size-[17px]" strokeWidth={1.5} />
      ) : (
        <Moon className="size-[17px]" strokeWidth={1.5} />
      )}
    </button>
  )
}
