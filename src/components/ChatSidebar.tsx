'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface ChatSidebarProps {
  embedded?: boolean;
}

export default function ChatSidebar({ embedded = false }: ChatSidebarProps) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [showSidebar, setShowSidebar] = useState(false)
  const { data: chats, mutate } = useSWR('/api/user/chats', fetcher)

  const unreadChats = chats?.filter((chat: any) => chat.unread > 0).length || 0

  if (embedded) {
    return (
      <div className="flex flex-col h-full">
        <div className="space-y-1 overflow-y-auto px-1">
          {chats?.length > 0 ? (
            chats.map((chat: any) => (
              <ChatLink key={chat.id} chat={chat} mutate={mutate} />
            ))
          ) : (
            <p className="text-center text-slate-400 text-xs py-10 italic">{t('chat.no_active_chats')}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Floating Sidebar Container */}
      {showSidebar && (
        <div className="glass-card w-80 h-[500px] mb-2 overflow-hidden flex flex-col rounded-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 bg-primary text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2">
              <FiMessageCircle />
              <h2 className="font-bold">{t('chat.chats')}</h2>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50/50">
            {chats?.map((chat: any) => (
              <ChatLink key={chat.id} chat={chat} mutate={mutate} />
            ))}
            {(!chats || chats.length === 0) && (
              <p className="text-center text-slate-400 text-sm py-10">{t('chat.no_messages')}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Floating Toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="w-14 h-14 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center relative group"
      >
        <FiMessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        {unreadChats > 0 && (
          <span className="absolute -top-1 -left-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white animate-pulse">
            {unreadChats}
          </span>
        )}
      </button>
    </div>
  )
}

function ChatLink({ chat, mutate }: { chat: any; mutate: any }) {
  const { t } = useLanguage()
  const lastMsg = chat.lastMessage;
  const isUnread = chat.unread > 0;

  return (
    <Link
      href={`/dashboard/messages/${chat.id}`}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${isUnread ? 'bg-blue-50 border border-blue-100 shadow-sm' : 'hover:bg-slate-100'
        }`}
      onClick={() => {
        if (isUnread) {
          fetch(`/api/user/chats/${chat.id}/read`, { method: 'POST' }).then(() => mutate())
        }
      }}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm">
          {(chat.company?.name || chat.user?.name || '?').charAt(0)}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <span className={`text-sm font-bold truncate ${isUnread ? 'text-primary' : 'text-slate-800'}`}>
            {chat.company?.name || chat.user?.name}
          </span>
          <span className="text-[10px] text-slate-400">
            {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>
        <p className={`text-xs truncate ${isUnread ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
          {lastMsg?.content || t('chat.start_new_conversation')}
        </p>
      </div>

      {isUnread && (
        <div className="w-2 h-2 bg-primary rounded-full" />
      )}
    </Link>
  )
}
