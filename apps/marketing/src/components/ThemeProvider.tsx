import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'

import type { EffectiveTheme, ThemeChoice } from '@/hooks/useTheme'
import type { ReactNode } from 'react'

import { ThemeContext } from '@/hooks/useTheme'

const STORAGE_KEY = 'theme'

function getStoredChoice(): ThemeChoice {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    /* SSR or private browsing */
  }
  return 'system'
}

/* ── System preference via useSyncExternalStore ── */
const mql =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null

function subscribeSystemTheme(cb: () => void): () => void {
  mql?.addEventListener('change', cb)
  return () => mql?.removeEventListener('change', cb)
}

function getSystemSnapshot(): boolean {
  return mql?.matches ?? true
}

function getServerSnapshot(): boolean {
  return true // assume dark for SSR / build
}

/* ── Apply class to <html> ── */
function applyTheme(effective: EffectiveTheme): void {
  const root = document.documentElement
  root.classList.toggle('dark', effective === 'dark')
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [choice, setChoiceState] = useState<ThemeChoice>(getStoredChoice)

  const systemIsDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemSnapshot,
    getServerSnapshot,
  )

  const effective: EffectiveTheme =
    choice === 'system' ? (systemIsDark ? 'dark' : 'light') : choice

  // Apply .dark class synchronously before paint to avoid intermediate states
  useLayoutEffect(() => {
    applyTheme(effective)
  }, [effective])

  const setChoice = useCallback((next: ThemeChoice) => {
    setChoiceState(next)
    try {
      if (next === 'system') {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, next)
      }
    } catch {
      /* quota exceeded or private browsing */
    }
  }, [])

  const value = useMemo(
    () => ({ choice, effective, setChoice }),
    [choice, effective, setChoice],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
