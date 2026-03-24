'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiX, FiCheckCircle } from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContext'
import RobotTourGuide from './RobotTourGuide'
import RobotCharacter from './RobotCharacter'

interface Message {
    id: number
    text: string
    isBot: boolean
    actions?: Array<{ label: string; href?: string; onClick?: () => void }>
}

export default function WelcomeBot() {
    const { data: session } = useSession()
    const router = useRouter()
    const { t, locale } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [hasSeenBot, setHasSeenBot] = useState(false)
    const [showTour, setShowTour] = useState(false)
    const [robotState, setRobotState] = useState<'neutral' | 'talking' | 'happy' | 'thinking' | 'waving'>('neutral')

    const isCompany = session?.user?.email?.includes('@company') || (session?.user as any)?.role === 'COMPANY'

    // Sync robot state with typing
    useEffect(() => {
        if (isTyping) {
            setRobotState('talking')
        } else {
            setRobotState('neutral')
        }
    }, [isTyping])

    useEffect(() => {
        const seen = localStorage.getItem('welcomeBotSeen')
        const tourCompleted = localStorage.getItem('tourCompleted')

        if (!seen && session?.user) {
            setHasSeenBot(false)
            setTimeout(() => {
                setIsOpen(true)
                startConversation()
            }, 2000)
        } else {
            setHasSeenBot(true)
        }

        // Auto-start tour if seen bot but not completed tour
        if (seen && !tourCompleted && session?.user) {
            setTimeout(() => {
                setShowTour(true)
            }, 3000)
        }

        if (typeof window !== 'undefined' && window.location.search.includes('tour=true')) {
            setTimeout(() => {
                setIsOpen(true)
                startConversation()
            }, 1000)
        }
    }, [session])

    const addMessage = (text: string, isBot: boolean = true, actions?: Message['actions']) => {
        return new Promise<void>((resolve) => {
            setIsTyping(true)
            setTimeout(() => {
                setMessages(prev => [...prev, { id: Date.now(), text, isBot, actions }])
                setIsTyping(false)
                resolve()
            }, isBot ? 1500 : 0) // Slightly longer to appreciate the talking animation
        })
    }

    const startConversation = async () => {
        setRobotState('waving')
        if (isCompany) {
            await addMessage(t('chatbot.welcome_company'))
            setRobotState('happy')
            await addMessage(t('chatbot.platform_overview_company'))
            await addMessage(t('chatbot.first_steps_company'), true, [
                { label: t('chatbot.action_post_job'), href: '/dashboard/company/jobs/new' },
                { label: t('chatbot.action_view_candidates'), href: '/dashboard/candidates' },
                { label: '🎯 ' + (t('tour.start') || 'Start Tour'), onClick: () => { setIsOpen(false); setShowTour(true); } }
            ])
        } else {
            await addMessage(t('chatbot.welcome_user'))
            setRobotState('happy')
            await addMessage(t('chatbot.platform_overview_user'))
            await addMessage(t('chatbot.first_steps_user'), true, [
                { label: t('chatbot.action_complete_cv'), href: '/dashboard/cv' },
                { label: t('chatbot.action_browse_jobs'), href: '/dashboard/jobs' },
                { label: '🎯 ' + (t('tour.start') || 'Start Tour'), onClick: () => { setIsOpen(false); setShowTour(true); } }
            ])
        }
    }

    const handleOpen = () => {
        setIsOpen(true)
        if (messages.length === 0) {
            startConversation()
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem('welcomeBotSeen', 'true')
        setHasSeenBot(true)
    }

    const handleActionClick = (action: { label: string; href?: string; onClick?: () => void }) => {
        setRobotState('happy')
        if (action.href) {
            router.push(action.href)
            setIsOpen(false)
        } else if (action.onClick) {
            action.onClick()
        }
    }

    return (
        <>
            {/* Floating Robot Icon */}
            {!isOpen && !showTour && (
                <button
                    onClick={handleOpen}
                    className="fixed bottom-6 left-6 z-50 group transition-transform hover:scale-110 active:scale-95"
                    aria-label="Open chat assistant"
                >
                    <RobotCharacter size="sm" state="happy" />
                    {!hasSeenBot && (
                        <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full border-2 border-white animate-bounce flex items-center justify-center text-[12px] font-bold z-10 text-white shadow-lg">!</span>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-6 left-6 z-50 w-96 h-[600px] flex flex-col pointer-events-none"
                    style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}
                >
                    {/* Character sitting on top of the chat window */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                        <RobotCharacter size="lg" state={robotState} />
                    </div>

                    <div className="flex-1 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-2 border-purple-500/30 relative mt-20 pointer-events-auto">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 flex items-center justify-between relative overflow-hidden pt-10">
                            <div className="absolute inset-0 bg-white/10 animate-pulse" />

                            <div className="flex items-center gap-4 relative z-10 px-2">
                                <div>
                                    <h3 className="font-bold text-sm">
                                        2NTA {t('chatbot.assistant')}
                                    </h3>
                                    <p className="text-[10px] text-purple-100 flex items-center gap-1 opacity-80">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        {t('chatbot.online')}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition relative z-10"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 backdrop-blur-md">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                    <div className="max-w-[85%]">
                                        <div
                                            className={`rounded-2xl px-4 py-3 shadow-lg ${msg.isBot
                                                ? 'bg-white/10 text-white border border-white/10'
                                                : 'bg-indigo-600 text-white'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>

                                        {msg.actions && msg.actions.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {msg.actions.map((action, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleActionClick(action)}
                                                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
                                                    >
                                                        <FiCheckCircle className="w-3 h-3" />
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10 backdrop-blur-sm">
                                        <div className="flex gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-900/80 border-t border-white/10 backdrop-blur-xl">
                            <button
                                onClick={handleClose}
                                className="w-full px-4 py-2 text-xs font-bold text-white bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/10"
                            >
                                {t('chatbot.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Robot Tour Guide */}
            {showTour && (
                <RobotTourGuide
                    onComplete={() => {
                        setShowTour(false)
                        localStorage.setItem('tourCompleted', 'true')
                        localStorage.setItem('welcomeBotSeen', 'true')
                    }}
                    onSkip={() => {
                        setShowTour(false)
                        localStorage.setItem('tourCompleted', 'true')
                        localStorage.setItem('welcomeBotSeen', 'true')
                    }}
                />
            )}
        </>
    )
}
