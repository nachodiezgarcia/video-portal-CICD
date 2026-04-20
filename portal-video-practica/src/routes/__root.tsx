import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router'
import { type QueryClient } from '@tanstack/react-query'
import { Header } from '../components/header/header.component'
import '../index.css'

export interface RouterContext {
  queryClient: QueryClient;
}

function RootDocument() {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
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
    links: [{ rel: 'icon', href: '/bannaNux_favicon.svg' }],
  }),
  shellComponent: RootDocument,
})
