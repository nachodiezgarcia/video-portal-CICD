/* eslint-disable react-refresh/only-export-components */
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { type QueryClient } from '@tanstack/react-query'
import { Header } from '../components/header/header.component'
import { ChatFab } from '../components/chat-fab/chat-fab.component'
import '../index.css'

export interface RouterContext {
  queryClient: QueryClient;
}

function RootLayout() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
      <ChatFab />
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})
