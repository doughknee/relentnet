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
      className="cursor-pointer rounded-md p-2 text-ink-sub transition-colors hover:text-gold"
    >
      {effective === 'dark' ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </button>
  )
}
