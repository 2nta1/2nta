'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useSWR from 'swr'
import { FiSend, FiPaperclip } from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ChatPage() {
  const { chatId } = useParams()
  const { t } = useLanguage()
  const [message, setMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const { data: chat, mutate } = useSWR(`/api/user/chats/${chatId}`, fetcher)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typing) setTyping(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [typing])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    await fetch('/api/user/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, content: message }),
    })

    setMessage('')
    mutate()
  }

  if (!chat) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>

  return (
    <div className="flex h-full">
      {/* Chat Info Sidebar */}
      <div className="w-64 bg-gray-100 border-r">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <img
              src={chat.company?.image || chat.user?.image || '/default-avatar.png'}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="font-medium">
                {chat.company?.name || chat.user?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {chat.company ? 'شركة' : 'مستخدم'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat.messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === chat.userId ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${msg.senderId === chat.userId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                  }`}
              >
                <p>{msg.content}</p>
                <span className="block text-xs text-right text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Typing Indicator */}
        {typing && (
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>يتم الكتابة...</span>
            </div>
          </div>
        )}

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <FiPaperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                setTyping(true)
              }}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
