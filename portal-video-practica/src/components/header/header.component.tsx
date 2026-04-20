import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './theme-toggle.component'
import { Breadcrumb } from './breadcrumb.component'

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement

    const syncTheme = () => {
      setIsDark(root.classList.contains('dark'))
    }

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="border-b border-(--color-border) bg-[color-mix(in_oklab,var(--color-surface),white_18%)]">
      <div className="mx-auto flex max-w-6xl flex-col px-(--space-md) py-(--space-sm) md:px-(--space-lg)">
        <div className="flex items-center justify-between gap-(--space-sm) rounded-3xl border border-(--color-border) bg-surface px-(--space-md) py-(--space-sm) shadow-sm">
          <Link to="/" className="flex items-center gap-3 no-underline text-(--color-text)">
            <img
              src={isDark ? '/bananux_logo_dark.svg' : '/bananux_logo.svg'}
              alt="Bana Nux"
              className="h-18 w-auto shrink-0"
            />
          </Link>

          <div className="hidden items-center gap-(--space-md) md:flex">
            <Link
              to="/"
              className="rounded-2xl border border-(--color-primary) px-(--space-lg) py-(--space-xs) font-semibold text-(--color-text) no-underline transition-colors hover:bg-primary-50"
            >
              Cursos
            </Link>
            <ThemeToggle />
            <Breadcrumb />
          </div>

          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-(--color-border) bg-background text-(--color-text) transition-colors hover:bg-primary-50 md:hidden"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Menú"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-(--space-sm) flex w-full max-w-6xl flex-col gap-(--space-sm) px-(--space-md) pb-(--space-sm) md:hidden"
        >
          <div className="flex flex-col gap-(--space-sm) rounded-3xl border border-(--color-border) bg-surface p-(--space-md) shadow-sm">
            <div className="flex items-center justify-between gap-(--space-sm)">
              <ThemeToggle />
              <Breadcrumb />
            </div>
            <Link
              to="/"
              className="rounded-2xl border border-(--color-primary) px-(--space-md) py-(--space-xs) text-center font-semibold text-(--color-text) no-underline transition-colors hover:bg-primary-50"
              onClick={() => setMenuOpen(false)}
            >
              Cursos
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
