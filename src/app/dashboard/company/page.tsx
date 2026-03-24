'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiEdit2, FiTrash2, FiUsers, FiEye, FiPlus } from 'react-icons/fi'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { translateText } from '@/utils/categoryTranslations'
import { translateLocation } from '@/utils/locationTranslations'

interface Job {
  id: string
  title: string
  description: string
  careerPath: string
  workType: string
  country: string
  city: string
  salaryFrom: number | null
  salaryTo: number | null
  createdAt: string
  isApproved: boolean
  _count?: {
    matches: number
  }
}

export default function CompanyDashboard() {
  const { data: session } = useSession()
  const { t, locale } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ activeJobs: 0, totalMatches: 0, profileViews: 842 })
  const [showPostBox, setShowPostBox] = useState(false)

  useEffect(() => {
    fetchCompanyJobs()
  }, [])

  const fetchCompanyJobs = async () => {
    try {
      const res = await fetch('/api/company/posts')
      if (res.ok) {
        const data = await res.json()
        setJobs(data)
        setStats(prev => ({
          ...prev,
          activeJobs: data.filter((j: Job) => j.isApproved).length,
          totalMatches: data.reduce((sum: number, j: Job) => sum + (j._count?.matches || 0), 0)
        }))
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
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

      {/* Create Post Box - Professional Creation Tool Style */}
      <div className="glass-card rounded-[2.5rem] p-6 mb-10 border-white/60 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            {session?.user?.name?.charAt(0) || 'C'}
          </div>
          <Link
            href="/dashboard/company/jobs/new"
            className="flex-1 px-6 py-4 bg-slate-50/50 hover:bg-white border border-slate-100 rounded-2xl text-slate-400 text-sm font-bold transition-all hover:border-blue-500/30 hover:shadow-md cursor-pointer"
          >
            {locale === 'ar' ? '📢 ماذا يدور في شركتك؟ انشر وظيفة أو تحديث جديد...' : '📢 What\'s on your mind? Post a new job or update...'}
          </Link>
          <Link
            href="/dashboard/company/jobs/new"
            className="px-8 py-4 btn-gradient rounded-2xl font-black text-sm flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            {locale === 'ar' ? 'نشر' : 'Post'}
          </Link>
        </div>
      </div>

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

        {jobs.length === 0 ? (
          <div className="glass-card rounded-[3rem] p-16 text-center border-dashed border-2 border-slate-200 bg-transparent">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
              <FiBriefcase className="w-12 h-12 text-blue-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">
              {locale === 'ar' ? 'ابدأ بمشاركة أخبار شركتك' : 'Start sharing your company news'}
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
              {locale === 'ar' ? 'المنشورات الاحترافية تساعد في جذب أفضل الكفاءات والمبدعين لعملك' : 'Professional posts help attract the best creative talents to your business'}
            </p>
            <Link
              href="/dashboard/company/jobs/new"
              className="inline-flex items-center gap-3 px-10 py-4 btn-gradient rounded-2xl font-black shadow-xl"
            >
              <FiPlus className="w-5 h-5" />
              {locale === 'ar' ? 'انشر أول وظيفة' : 'Post First Job'}
            </Link>
          </div>
        ) : (
          jobs.map((job) => (
            <article
              key={job.id}
              className="glass-card rounded-[2.5rem] overflow-hidden hover:scale-[1.01] transition-all duration-500 group premium-shadow"
            >
              {/* Post Header */}
              <div className="p-6 flex items-center justify-between border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                    {session?.user?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{session?.user?.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      {getTimeAgo(job.createdAt)} • {locale === 'ar' ? 'نشر وظيفة' : 'Posted a job'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!job.isApproved && (
                    <span className="px-5 py-2 bg-amber-50 text-amber-600 rounded-full text-[11px] font-black uppercase tracking-tighter border border-amber-100">
                      {locale === 'ar' ? '⏳ قيد المراجعة' : '⏳ Pending'}
                    </span>
                  )}
                  <Link
                    href={`/dashboard/company/jobs/${job.id}/edit`}
                    className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all flex items-center justify-center text-slate-400 border border-transparent hover:border-slate-100"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:translate-x-1 transition-transform">
                  {job.title}
                </h2>

                <p className="text-slate-600 mb-8 line-clamp-3 text-base leading-relaxed font-medium">
                  {job.description}
                </p>

                {/* Job Tags - Premium Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-tighter border border-blue-100/50">
                    <FiBriefcase className="w-4 h-4" />
                    {translateText(job.careerPath, locale)}
                  </span>

                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50/50 text-purple-700 rounded-xl text-xs font-black uppercase tracking-tighter border border-purple-100/50">
                    <FiClock className="w-4 h-4" />
                    {translateText(job.workType, locale)}
                  </span>

                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50/50 text-green-700 rounded-xl text-xs font-black uppercase tracking-tighter border border-green-100/50">
                    <FiMapPin className="w-4 h-4" />
                    {translateLocation(job.city, locale)}, {translateLocation(job.country, locale)}
                  </span>

                  {job.salaryFrom && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50/50 text-amber-700 rounded-xl text-xs font-black uppercase tracking-tighter border border-amber-100/50">
                      <FiDollarSign className="w-4 h-4" />
                      {job.salaryFrom?.toLocaleString()} - {job.salaryTo?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Post Stats - Modern Interaction Bar */}
              <div className="px-8 py-5 border-t border-slate-100/50 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                        <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-tighter ml-2">
                    {job._count?.matches || 0} {locale === 'ar' ? 'مطابقات ذكية' : 'Smart Matches'}
                  </span>
                </div>

                <Link
                  href={`/dashboard/company/jobs/${job.id}`}
                  className="px-6 py-2.5 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100 shadow-sm hover:shadow-md hover:bg-blue-600 hover:text-white transition-all"
                >
                  {locale === 'ar' ? 'عرض المرشحين ←' : 'View Candidates →'}
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
