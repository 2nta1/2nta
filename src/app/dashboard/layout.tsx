'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { FiHome, FiUser, FiLogOut, FiBell, FiSearch, FiSettings, FiBriefcase, FiShield } from 'react-icons/fi'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import ChatSidebar from '@/components/ChatSidebar'
import WelcomeBot from '@/components/WelcomeBot'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { t, locale } = useLanguage()

  const [avatar, setAvatar] = useState<string | null>(null);
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data: notifs } = useSWR('/api/user/notifications', fetcher, { refreshInterval: 30000 });
  const unread = (notifs || []).filter((n: any) => !n.readAt).length;

  useEffect(() => {
    fetch('/api/user/settings', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setAvatar(data?.image ?? null));
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F0F2F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const menuItems = [
    { label: t('dashboard.home'), icon: FiHome, href: '/dashboard/user' },
    { label: t('dashboard.jobs'), icon: FiBriefcase, href: '/dashboard/jobs' },
    { label: t('dashboard.cv'), icon: FiUser, href: '/dashboard/cv' },
    { label: t('dashboard.notifications'), icon: FiBell, href: '/dashboard/notifications', badge: unread },
    { label: t('dashboard.settings'), icon: FiSettings, href: '/dashboard/settings' },
  ]

  // If inside company dashboard, use simplified layout or specific company layout elsewhere
  if (pathname?.startsWith('/dashboard/company')) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex-1">
        {children}
        <WelcomeBot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans">
      {/* Top Bar - Premium Glassmorphism */}
      <header className="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between px-6">
        <div className="flex items-center gap-6 flex-1">
          <Link href="/dashboard/user" className="hidden md:flex items-center gap-2 group" dir="ltr">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              <span className="font-black text-xl italic uppercase">2</span>
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">NTA</span>
          </Link>
          <div className="relative group max-w-sm w-full">
            <FiSearch className={`absolute ${locale === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors`} />
            <input
              type="text"
              placeholder={t('dashboard.search_placeholder')}
              className={`w-full h-10 ${locale === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-slate-100/50 border border-slate-200/50 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all !text-slate-900`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-green-50/50 text-green-600 rounded-full text-[11px] font-bold border border-green-100/50">
            <FiShield className="text-sm" />
            {t('common.secure_connection')}
          </div>

          <Link href="/dashboard/notifications" className="w-10 h-10 rounded-2xl bg-slate-100/50 flex items-center justify-center text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-md transition-all relative">
            <FiBell className="text-xl" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-[10px] font-black px-1 border-2 border-white shadow-sm scale-110">
                {unread}
              </span>
            )}
          </Link>

          <button onClick={handleLogout} className="w-10 h-10 rounded-2xl bg-slate-100/50 flex items-center justify-center text-red-500 hover:bg-red-50 hover:shadow-md transition-all">
            <FiLogOut className="text-xl" />
          </button>

          <div className="w-[1px] h-6 bg-slate-200 mx-2 hidden md:block" />

          <Link href="/dashboard/settings" className="flex items-center gap-3 p-1 hover:bg-slate-100/50 rounded-2xl transition-all pr-2">
            <div className="w-9 h-9 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 text-xs font-bold uppercase">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </Link>
        </div>
      </header >

      <div className="flex flex-1 max-w-7xl mx-auto w-full pt-8 px-6 gap-8">
        {/* Floating Sidebar Navigation - Glassmorphism */}
        <aside className="hidden lg:block w-72 h-[calc(100vh-7rem)] sticky top-24">
          <div className="space-y-6">
            <div className="glass-card rounded-[2rem] p-5">
              <div className="flex items-center gap-4 p-2 mb-6 border-b border-slate-100/50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 text-lg">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-black text-slate-900 truncate">{session?.user?.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{locale === 'ar' ? 'متصل الآن' : 'Active Now'}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1.5">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${pathname === item.href ? 'nav-item-active' : 'nav-item-inactive'}`}
                  >
                    <item.icon className={`text-xl ${pathname === item.href ? 'text-blue-600' : ''}`} />
                    <span className="text-[14px] font-semibold">{item.label}</span>
                    {item.badge ? (
                      <span className={`${locale === 'ar' ? 'mr-auto' : 'ml-auto'} bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-sm`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-[2rem] p-8 text-white premium-shadow relative overflow-hidden group">
              <div className="relative z-10">
                <p className="font-black text-lg mb-2 leading-tight">{t('user.looking_for_job')}</p>
                <p className="text-xs text-blue-50/80 mb-6 leading-relaxed font-medium">{t('user.complete_profile')}</p>
                <Link href="/dashboard/cv" className="block w-full py-3 bg-white text-blue-600 rounded-2xl text-center text-xs font-black hover:bg-blue-50 transition-all shadow-xl shadow-black/10">
                  {t('user.update_cv')}
                </Link>
              </div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
            </div>

            <div className="px-6">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-default leading-loose">
                {t('common.privacy')} · {t('common.terms')} · {t('common.ads')} <br /> {t('common.copyright')}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Feed Content */}
        <main className="flex-1 min-w-0 pb-20">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Premium Glassmorphism */}
        <aside className="hidden xl:block w-80 h-[calc(100vh-7rem)] sticky top-24">
          <div className="glass-card rounded-[2rem] p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('user.active_chats')}</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ChatSidebar embedded />
            </div>
          </div>
        </aside>
      </div>

      {/* Welcome Chatbot */}
      <WelcomeBot />
    </div >
  )
}