'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiHeart, FiMessageCircle, FiShare2, FiBookmark, FiMessageSquare, FiSearch } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
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
  company: {
    id: string
    name: string
    image: string | null
    industry: string | null
  }
}

export default function UserDashboard() {
  const { data: session } = useSession()
  const { t, locale } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs')
      if (res.ok) {
        const data = await res.json()
        setJobs(data.slice(0, 20))
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
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return locale === 'ar' ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`
    if (diffHours < 24) return locale === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`
    return locale === 'ar' ? `منذ ${diffDays} يوم` : `${diffDays}d ago`
  }

  const handleApply = async (jobId: string) => {
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      })
      if (res.ok) {
        toast.success(locale === 'ar' ? 'تم التقديم بنجاح' : 'Applied successfully')
      } else {
        const data = await res.json()
        toast.error(data.error || (locale === 'ar' ? 'خطأ في التقديم' : 'Application failed'))
      }
    } catch (error) {
      toast.error(locale === 'ar' ? 'حدث خطأ ما' : 'Something went wrong')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Welcome Header - Premium Glassmorphism */}
      <div className="glass-card rounded-[2.5rem] p-8 mb-10 relative overflow-hidden group border-white/60">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            {locale === 'ar' ? '👋 مرحباً' : '👋 Welcome'} {session?.user?.name}!
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-md">
            {locale === 'ar'
              ? 'لقد وجدنا لك مجموعة من الفرص الوظيفية التي تناسب مهاراتك وخبراتك تماماً.'
              : 'We\'ve found some exciting job opportunities that perfectly match your skills and experience.'}
          </p>
        </div>
      </div>

      {/* Jobs Feed */}
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 lowercase tracking-tight">
            <span className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full shadow-sm" />
            {locale === 'ar' ? 'الوظائف المقترحة لك' : 'Matched Jobs for you'}
          </h2>
          <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            {locale === 'ar' ? 'محدث' : 'Updated'}
          </div>
        </div>

        {jobs.length > 0 ? (
          jobs.map((job) => (
            <article
              key={job.id}
              className="glass-card rounded-[2.5rem] overflow-hidden hover:scale-[1.01] transition-all duration-500 group premium-shadow border-white/50"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:rotate-3 transition-transform">
                      {job.company?.name?.[0] || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.company?.name}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1.5">
                        <FiMapPin className="text-blue-400" />
                        {translateLocation(job.city, locale)}, {translateLocation(job.country, locale)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-4 py-1.5 bg-blue-50/50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100/50 shadow-sm">
                      {translateText(job.workType, locale)}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{getTimeAgo(job.createdAt)}</p>
                  </div>
                </div>

                <Link href={`/dashboard/jobs/${job.id}`}>
                  <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:translate-x-1 transition-transform">{job.title}</h2>
                </Link>

                <p className="text-slate-600 mb-8 line-clamp-3 text-base leading-relaxed font-medium">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-tighter border border-slate-200/50">
                    <FiBriefcase className="w-4 h-4 text-slate-400" />
                    {translateText(job.careerPath, locale)}
                  </span>
                  {job.salaryFrom && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50/50 text-green-700 rounded-xl text-xs font-black uppercase tracking-tighter border border-green-100/50">
                      <FiDollarSign className="w-4 h-4" />
                      {job.salaryFrom?.toLocaleString()} - {job.salaryTo?.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleApply(job.id)}
                    className="flex-1 py-4 btn-gradient rounded-[1.25rem] font-black text-sm shadow-xl flex items-center justify-center gap-2 group/btn"
                  >
                    {locale === 'ar' ? 'تقدم للوظيفة الآن' : 'Apply For Job Now'}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button className="w-14 h-14 rounded-[1.25rem] bg-slate-100/50 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center text-slate-400 border border-transparent hover:border-red-100 hover:shadow-md">
                    <FiHeart className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Social-style Action Bar */}
              <div className="px-8 py-5 border-t border-slate-100/50 bg-slate-50/50 flex items-center justify-around gap-2">
                <button className="social-button text-sm group">
                  <FiMessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{locale === 'ar' ? 'اسأل' : 'Ask'}</span>
                </button>
                <button className="social-button text-sm group">
                  <FiBookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{locale === 'ar' ? 'حفظ' : 'Save'}</span>
                </button>
                <button className="social-button text-sm group">
                  <FiShare2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{locale === 'ar' ? 'مشاركة' : 'Share'}</span>
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-card rounded-[3rem] p-16 text-center border-dashed border-2 border-slate-200 bg-transparent">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
              <FiSearch className="w-12 h-12 text-blue-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">
              {locale === 'ar' ? 'لا توجد وظائف مطابقة حالياً' : 'No matches found yet'}
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium leading-relaxed">
              {locale === 'ar'
                ? 'تأكد من إكمال ملفك الشخصي وتحميل سيرتك الذاتية لزيادة فرص ظهورك للشركات.'
                : 'Make sure to complete your profile and upload your CV to increase your visibility to companies.'}
            </p>
            <Link
              href="/dashboard/cv"
              className="inline-flex items-center gap-3 px-10 py-4 btn-gradient rounded-2xl font-black shadow-xl"
            >
              {locale === 'ar' ? 'تحديث السيرة الذاتية' : 'Update Resume'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}