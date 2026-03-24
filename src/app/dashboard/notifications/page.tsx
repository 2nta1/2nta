'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { FiBell, FiCheck, FiBriefcase, FiMessageSquare, FiInfo } from 'react-icons/fi'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function NotificationsPage() {
  const { t, locale } = useLanguage()
  const { data, mutate, isLoading } = useSWR('/api/user/notifications', fetcher)

  const markRead = async (id: string) => {
    await fetch('/api/user/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    mutate()
  }

  if (isLoading) return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  )

  if (!data || data.length === 0) return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="glass-card rounded-[3rem] p-16 border-dashed border-2 border-slate-200">
        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <FiInfo className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">{t('notifications.no_notifications')}</h3>
        <p className="text-slate-500 font-medium">{locale === 'ar' ? 'كل شيء هادئ هنا حالياً.' : 'Everything is quiet here for now.'}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="glass-card rounded-[2.5rem] p-8 mb-10 border-white/60">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FiBell className="w-6 h-6" />
          </div>
          {t('notifications.title')}
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          {locale === 'ar' ? 'ابق على اطلاع بآخر التحديثات والرسائل.' : 'Stay updated with the latest alerts and messages.'}
        </p>
      </div>

      <div className="space-y-6">
        {data.map((n: any) => (
          <article
            key={n.id}
            className={`glass-card rounded-[2rem] p-6 premium-shadow border-white/50 transition-all duration-300 ${!n.readAt ? 'ring-2 ring-blue-500/20 bg-blue-50/10' : ''}`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-3">
                  <Link
                    href={n.companyId ? `/dashboard/companies/${n.companyId}` : '#'}
                    className="text-lg font-black text-slate-900 hover:text-blue-600 transition-colors tracking-tight uppercase"
                  >
                    {n.title}
                  </Link>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-slate-600 font-medium leading-relaxed mb-4">
                  {n.message}
                </p>

                <div className="flex flex-wrap gap-3">
                  {n.data?.jobId && (
                    <Link
                      href={`/dashboard/jobs/${n.data.jobId}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100/50 hover:bg-blue-100 transition-all"
                    >
                      <FiBriefcase className="w-4 h-4" />
                      {t('notifications.view_job_details')}
                    </Link>
                  )}
                  {n.data?.chatId && (
                    <Link
                      href={`/dashboard/messages/${n.data.chatId}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100/50 hover:bg-indigo-100 transition-all"
                    >
                      <FiMessageSquare className="w-4 h-4" />
                      {t('notifications.start_conversation')}
                    </Link>
                  )}
                </div>
              </div>

              {!n.readAt && (
                <button
                  onClick={() => markRead(n.id)}
                  className="w-10 h-10 rounded-2xl bg-blue-50/50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-all group"
                  title={t('notifications.mark_as_read')}
                >
                  <FiCheck className="w-5 h-5 group-hover:scale-110" />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
