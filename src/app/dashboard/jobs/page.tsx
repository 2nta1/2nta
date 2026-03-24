'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiCheck, FiX } from 'react-icons/fi'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { translateText } from '@/utils/categoryTranslations';
import { translateLocation } from '@/utils/locationTranslations';

const JOB_TYPE_MAP: Record<string, { en: string; ar: string }> = {
  FULL_TIME: { en: 'Full Time', ar: 'دوام كامل' },
  PART_TIME: { en: 'Part Time', ar: 'دوام جزئي' },
  REMOTE: { en: 'Remote', ar: 'عمل عن بعد' },
  TEMPORARY: { en: 'Temporary', ar: 'مؤقت' },
  FREELANCE: { en: 'Freelance', ar: 'عمل حر' },
  INTERNSHIP: { en: 'Internship', ar: 'تدريب' },
};

interface Job {
  id: string
  title: string
  company: string
  companyId?: string
  location: string
  salary: string
  type: string
  description: string
  requirements: string[]
  matchScore: number
  status: 'pending' | 'accepted' | 'rejected'
}

export default function JobsPage() {
  const { data: session } = useSession()
  const { t, locale } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/jobs')
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleApply = async (jobId: string) => {
    try {
      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      })

      if (response.ok) {
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? { ...job, status: 'pending' } : job
          )
        )
      }
    } catch (error) {
      console.error('Error applying to job:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="glass-card rounded-[2.5rem] p-8 mb-10 border-white/60">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('jobs.available_jobs')}</h3>
        <p className="text-slate-500 font-medium">
          {t('jobs.browse_jobs_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="glass-card rounded-[2.5rem] overflow-hidden hover:scale-[1.01] transition-all duration-500 group premium-shadow border-white/50 cursor-pointer"
            onClick={() => setSelectedJob(job)}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-3 transition-transform">
                    <FiBriefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                      {translateText(job.title, locale as 'ar' | 'en')}
                    </h3>
                    <Link
                      href={job.companyId ? `/dashboard/companies/${job.companyId}` : '#'}
                      className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {job.company}
                    </Link>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${job.status === 'accepted'
                    ? 'bg-green-50/50 text-green-600 border-green-100/50'
                    : job.status === 'rejected'
                      ? 'bg-red-50/50 text-red-600 border-red-100/50'
                      : 'bg-yellow-50/50 text-yellow-600 border-yellow-100/50'
                    }`}
                >
                  {job.status === 'accepted'
                    ? t('jobs.status_accepted')
                    : job.status === 'rejected'
                      ? t('jobs.status_rejected')
                      : t('jobs.status_pending')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  <FiMapPin className="text-blue-400" />
                  {job.location.split(' - ').map(p => translateLocation(p.trim(), locale as 'ar' | 'en')).join(' - ')}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  <FiDollarSign className="text-green-500" />
                  {job.salary}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  <FiClock className="text-purple-500" />
                  {JOB_TYPE_MAP[job.type]?.[locale as 'ar' | 'en'] || job.type}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    {t('jobs.match_score')}
                  </span>
                  <span className="text-xs font-black text-blue-600 leading-none">
                    {job.matchScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${job.matchScore}%` }}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Job Details Modal - Premium Glassmorphism */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative glass-card w-full max-w-2xl rounded-[3rem] p-10 premium-shadow border-white/60 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {translateText(selectedJob.title, locale as 'ar' | 'en')}
                </h3>
                <Link
                  href={selectedJob.companyId ? `/dashboard/companies/${selectedJob.companyId}` : '#'}
                  className="text-sm font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                >
                  {selectedJob.company}
                </Link>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-12 h-12 rounded-2xl bg-slate-100/50 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center text-slate-400 group"
              >
                <FiX className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('jobs.location')}</h4>
                  <p className="text-sm font-bold text-slate-900">{selectedJob.location.split(' - ').map(p => translateLocation(p.trim(), locale as 'ar' | 'en')).join(' - ')}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('jobs.salary')}</h4>
                  <p className="text-sm font-bold text-slate-900">{selectedJob.salary}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('jobs.type')}</h4>
                  <p className="text-sm font-bold text-slate-900">{JOB_TYPE_MAP[selectedJob.type]?.[locale as 'ar' | 'en'] || selectedJob.type}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('jobs.description')}</h4>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('jobs.requirements')}</h4>
                <ul className="space-y-3">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-600 font-medium">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('jobs.match_score')}</span>
                  <span className="text-lg font-black text-blue-600">{selectedJob.matchScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 shadow-inner overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    style={{ width: `${selectedJob.matchScore}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                  onClick={() => setSelectedJob(null)}
                >
                  {t('jobs.close')}
                </button>
                {!selectedJob.status && (
                  <button
                    className="px-10 py-4 btn-gradient text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 group/btn"
                    onClick={() => handleApply(selectedJob.id)}
                  >
                    <FiCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {t('jobs.apply_now')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}