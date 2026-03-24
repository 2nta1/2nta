'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiMessageCircle, FiUser, FiBriefcase } from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContext'

interface Chat {
    id: string
    type: string
    userId: string | null
    companyId: string | null
    user: { id: string; name: string; image: string | null } | null
    company: { id: string; name: string; image: string | null } | null
    messages: { id: string; content: string; createdAt: string }[]
    createdAt: string
    updatedAt: string
}

export default function MessagesPage() {
    const { data: session, status } = useSession()
    const { t } = useLanguage()
    const router = useRouter()
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'authenticated') {
            fetchChats()
        }
    }, [status])

    const fetchChats = async () => {
        try {
            console.log('Fetching chats from /api/user/chats')
            const res = await fetch('/api/user/chats')
            console.log('Chats API response status:', res.status)

            if (res.ok) {
                const data = await res.json()
                console.log('Chats data received:', data)
                setChats(data)
            } else {
                console.error('Failed to fetch chats:', res.statusText)
                setChats([]) // Set empty array on error
            }
        } catch (error) {
            console.error('Error fetching chats:', error)
            setChats([]) // Set empty array on error
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (chats.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FiMessageCircle className="w-16 h-16 mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2">{t('messages.no_conversations')}</h3>
                <p className="text-sm">{t('messages.start_by_applying')}</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {t('messages.your_conversations')}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {t('messages.manage_conversations')}
                    </p>
                </div>

                <div className="divide-y divide-gray-200">
                    {chats.map((chat) => {
                        const otherParty = chat.company || chat.user
                        const lastMessage = chat.messages[chat.messages.length - 1]

                        return (
                            <div
                                key={chat.id}
                                onClick={() => router.push(`/dashboard/messages/${chat.id}`)}
                                className="px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center flex-1 min-w-0">
                                        <div className="flex-shrink-0">
                                            {otherParty?.image ? (
                                                <img
                                                    src={otherParty.image}
                                                    alt={otherParty.name}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    {chat.company ? (
                                                        <FiBriefcase className="h-6 w-6 text-gray-500" />
                                                    ) : (
                                                        <FiUser className="h-6 w-6 text-gray-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mr-4 flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {otherParty?.name || t('messages.unknown_user')}
                                            </h4>
                                            {lastMessage && (
                                                <p className="text-sm text-gray-500 truncate">
                                                    {lastMessage.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mr-4 flex-shrink-0 flex flex-col items-end">
                                        {lastMessage && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(lastMessage.createdAt).toLocaleDateString('ar-EG', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                            {chat.company ? t('messages.company') : t('messages.user')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
