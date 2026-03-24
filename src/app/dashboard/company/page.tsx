'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiEdit2, FiTrash2, FiUsers, FiEye, FiPlus, FiMessageSquare, FiZap } from 'react-icons/fi'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { translateText } from '@/utils/categoryTranslations'
import { translateLocation } from '@/utils/locationTranslations'
import PostGenerator from '@/components/company/PostGenerator'

interface Post {
  id: string
  content: string
  type: string
  image: string | null
  createdAt: string
  company: {
    name: string
    image: string | null
  }
}

export default function CompanyDashboard() {
  const { data: session } = useSession()
  const { t, locale } = useLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ activeJobs: 0, totalMatches: 0, profileViews: 842 })
  const [showGenerator, setShowGenerator] = useState(false)

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      const res = await fetch('/api/company/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
        // Static stats for demo, in production these would come from a dedicated stats API
        setStats(prev => ({
          ...prev,
          activeJobs: 3,
          totalMatches: 12
        }))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const posted = new Date(date)
    const diffMs = now.getTime() - posted.getTime()
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffHours < 24) return locale === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`
    return locale === 'ar' ? `منذ ${diffDays} يوم` : `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      {/* Stats Cards - Premium Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card rounded-[2rem] p-8 group hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100/50">
              <FiBriefcase className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                {locale === 'ar' ? 'الوظائف النشطة' : 'Active Jobs'}
              </p>
              <p className="text-4xl font-black text-slate-900 leading-none">{stats.activeJobs}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-8 group hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-indigo-100/50">
              <FiUsers className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                {locale === 'ar' ? 'إجمالي المطابقات' : 'Total Matches'}
              </p>
              <p className="text-4xl font-black text-slate-900 leading-none">{stats.totalMatches}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-8 group hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-purple-100/50">
              <FiEye className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                {locale === 'ar' ? 'مشاهدات الملف' : 'Profile Views'}
              </p>
              <p className="text-4xl font-black text-slate-900 leading-none">{stats.profileViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Generator - Premium Tool */}
      {showGenerator ? (
        <PostGenerator 
          companyName={session?.user?.name || "شركتنا"} 
          onPostCreated={() => {
            setShowGenerator(false)
            fetchCompanyData()
          }}
        />
      ) : (
        <div className="glass-card rounded-[2.5rem] p-6 mb-10 border-white/60 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
              {session?.user?.name?.charAt(0) || 'C'}
            </div>
            <button
              onClick={() => setShowGenerator(true)}
              className="flex-1 px-6 py-4 bg-slate-50/50 hover:bg-white border border-slate-100 rounded-2xl text-slate-400 text-sm font-bold transition-all hover:border-blue-500/30 hover:shadow-md text-right flex items-center justify-between"
            >
              <span>{locale === 'ar' ? '📢 ماذا يدور في شركتك؟ انشر وظيفة أو إنجاز جديد...' : '📢 What\'s on your mind? Post a job or milestone...'}</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <FiPlus />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Company Activity Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full shadow-sm" />
            {locale === 'ar' ? 'نشاط الشركة الأخير' : 'Recent Company Activity'}
          </h2>
          <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            {locale === 'ar' ? 'مباشر' : 'Live'}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="glass-card rounded-[3rem] p-16 text-center border-dashed border-2 border-slate-200 bg-transparent">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
              <FiMessageSquare className="w-12 h-12 text-blue-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">
              {locale === 'ar' ? 'ابدأ بمشاركة أخبار شركتك' : 'Start sharing your company news'}
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
              {locale === 'ar' ? 'المنشورات الاحترافية تساعد في جذب أفضل الكفاءات والمبدعين لعملك' : 'Professional posts help attract the best creative talents to your business'}
            </p>
            <button
              onClick={() => setShowGenerator(true)}
              className="inline-flex items-center gap-3 px-10 py-4 btn-gradient rounded-2xl font-black shadow-xl"
            >
              <FiZap className="w-5 h-5" />
              {locale === 'ar' ? 'انشر أول بوست ذكي' : 'Post First Smart Post'}
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="glass-card rounded-[2.5rem] overflow-hidden hover:scale-[1.01] transition-all duration-500 group premium-shadow"
            >
              {/* Post Header */}
              <div className="p-6 flex items-center justify-between border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                    {post.company?.image ? (
                      <img src={post.company.image} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      post.company?.name?.charAt(0) || 'C'
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{post.company.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      {getTimeAgo(post.createdAt)} • {translateText(post.type, locale)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-8">
                <p className="text-slate-800 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.image && (
                  <div className="mt-6 rounded-3xl overflow-hidden border border-slate-100 shadow-lg">
                    <img src={post.image} alt="post" className="w-full object-cover max-h-[400px]" />
                  </div>
                ) }
              </div>

              {/* Interaction Bar */}
              <div className="px-8 py-5 border-t border-slate-100/50 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-xs uppercase tracking-widest">
                    <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">👍</span>
                    {locale === 'ar' ? 'أعجبني' : 'Like'}
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-xs uppercase tracking-widest">
                    <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">💬</span>
                    {locale === 'ar' ? 'تعليق' : 'Comment'}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
