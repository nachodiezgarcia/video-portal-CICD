import { createRootRouteWithContext, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { type QueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Home, Menu, X } from 'lucide-react'
import '../index.css'

export interface RouterContext {
  queryClient: QueryClient;
}

function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  const toggle = () => {
    document.documentElement.classList.toggle('dark')
    setDark(prev => !prev)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative w-12 h-6 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)] transition-colors flex items-center"
    >
      <span
        className={`absolute w-4 h-4 rounded-full bg-[var(--color-primary)] transition-transform ${dark ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}

function RootDocument() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <img src="/bananux_logo.svg" alt="Bana Nux" className="h-10 w-auto" />
              <span className="font-bold text-sm tracking-wide text-[var(--color-text)]">BANA NUX</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className="px-6 py-1.5 border-2 border-[var(--color-text)] rounded font-semibold text-[var(--color-text)] no-underline hover:bg-[var(--color-text)] hover:text-[var(--color-bg-page)] transition-colors"
              >
                Cursos
              </Link>
              <DarkModeToggle />
              <Link to="/" aria-label="Inicio" className="text-[var(--color-text)]">
                <Home size={20} />
              </Link>
            </div>

            <button
              className="md:hidden text-[var(--color-text)]"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Menú"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {menuOpen && (
            <div className="md:hidden flex flex-col gap-3 pt-3 px-2 pb-2">
              <Link to="/" className="font-semibold text-[var(--color-text)] no-underline" onClick={() => setMenuOpen(false)}>
                Cursos
              </Link>
              <DarkModeToggle />
            </div>
          )}
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </main>
      </body>
    </html>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Campus' },
    ],
    links: [{ rel: 'icon', href: '/assets/bannaNux_favicon.svg' }],
  }),
  shellComponent: RootDocument,
})
