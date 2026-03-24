'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
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
  location: string
  type: string
  status: string
  createdAt: string
  _count: {
    applications: number
    matches: number
  }
}

export default function CompanyJobsPage() {
  const router = useRouter()
  const { t, locale } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string>('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/company/jobs')
        if (!response.ok) {
          throw new Error(t('jobs.load_failed'))
        }
        const data = await response.json()
        setJobs(data)
      } catch (err: any) {
        setError(err.message || t('jobs.error_occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      DRAFT: { text: t('jobs.draft'), color: 'bg-gray-100 text-gray-800' },
      ACTIVE: { text: t('jobs.active'), color: 'bg-green-100 text-green-800' },
      PAUSED: { text: t('jobs.paused'), color: 'bg-yellow-100 text-yellow-800' },
      CLOSED: { text: t('jobs.closed'), color: 'bg-red-100 text-red-800' }
    }
    const statusInfo = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    )
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm(t('jobs.delete_confirm'))) return
    try {
      setDeleting(jobId)
      const res = await fetch(`/api/company/jobs/${jobId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(t('jobs.delete_failed'))
      setJobs(jobs.filter((j) => j.id !== jobId))
    } catch (e: any) {
      alert(e.message || t('jobs.error'))
    } finally {
      setDeleting('')
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
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t('jobs.page_title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('jobs.page_desc')}</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/company/jobs/new')}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="ml-1" />
          {t('jobs.add_job')}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('jobs.no_jobs')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('jobs.post_first_job')}</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.push('/dashboard/company/jobs/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                {t('jobs.add_job')}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('jobs.job_title')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('jobs.location')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('jobs.type')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('jobs.status')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('jobs.applications')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('jobs.applicants')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('jobs.date')}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t('jobs.actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {translateText(job.title, locale as 'ar' | 'en')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {job.location.split(' - ').map(p => translateLocation(p.trim(), locale as 'ar' | 'en')).join(' - ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {JOB_TYPE_MAP[job.type]?.[locale as 'ar' | 'en'] || job.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/dashboard/jobs/${job.id}/matches`} className="text-blue-600 hover:underline">
                        {job._count.matches}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job._count.applications}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => router.push(`/dashboard/company/jobs/${job.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="عرض"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/company/jobs/${job.id}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="تعديل"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className={`text-red-600 hover:text-red-900 ${deleting === job.id ? 'opacity-50 pointer-events-none' : ''}`}
                          title="حذف"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}