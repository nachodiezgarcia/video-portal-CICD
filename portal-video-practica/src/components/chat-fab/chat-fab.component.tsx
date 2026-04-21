import { MessageCircle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export const ChatFab = () => {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      aria-label="Abrir chat IA"
      onClick={() => navigate({ to: '/chat' })}
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-info bg-info text-text-info shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
    >
      <MessageCircle size={24} strokeWidth={2.2} />
    </button>
  )
}
