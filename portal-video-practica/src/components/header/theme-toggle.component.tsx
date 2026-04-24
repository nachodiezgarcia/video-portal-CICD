import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export const ThemeToggle = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggle = () => {
    document.documentElement.classList.toggle('dark')
    setDark(prev => !prev)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar tema"
      aria-pressed={dark}
      className="inline-flex h-11 w-[4.5rem] items-center rounded-full border border-(--color-border) bg-surface px-1 text-(--color-text) shadow-sm transition-colors duration-300"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--color-primary-500),transparent_72%)] bg-background shadow-sm transition-transform duration-300 ${dark ? 'translate-x-[1.95rem]' : 'translate-x-0'}`}
      >
        {dark ? <Moon size={16} /> : <Sun size={16} />}
      </span>
    </button>
  )
}
