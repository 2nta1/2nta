'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiCheck, FiArrowRight, FiInfo } from 'react-icons/fi'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function JobDetailsPage() {
    const params = useParams()
    const id = params?.id
    const { data: job, error, isLoading, mutate } = useSWR(id ? `/api/jobs/${id}` : null, fetcher)
    const [isApplying, setIsApplying] = useState(false)

    const handleApply = async () => {
        if (!job) return
        setIsApplying(true)
        try {
            const response = await fetch('/api/jobs/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId: job.id }),
            })

            if (response.ok) {
                toast.success('تم التقديم بنجاح!')
                mutate() // Refresh job data to show new status
            } else {
                toast.error('حدث خطأ أثناء التقديم')
            }
        } catch (e) {
            toast.error('حدث خطأ في الخادم')
        } finally {
            setIsApplying(false)
        }
    }

    if (error) return (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-red-100">
            <p className="text-red-500 font-bold text-lg">حدث خطأ في تحميل تفاصيل الوظيفة.</p>
            <Link href="/dashboard/jobs" className="text-blue-600 hover:underline mt-4 inline-flex items-center gap-2">
                <FiArrowRight /> العودة لقائمة الوظائف
            </Link>
        </div>
    )

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
    )

    if (!job) return null

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/dashboard/companies/${job.companyId}`}
                                className="text-xl text-blue-600 hover:underline font-bold"
                            >
                                {job.company}
                            </Link>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500 flex items-center gap-1">
                                <FiMapPin /> {job.location}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${job.status === 'accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                            job.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                job.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                    'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                            {job.status === 'accepted' ? 'تم القبول' :
                                job.status === 'rejected' ? 'تم الرفض' :
                                    job.status === 'pending' ? 'قيد المراجعة' : 'متاحة للتقديم'}
                        </span>
                        <p className="text-xs text-gray-400">نُشرت بتاريخ {new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-50 pt-8">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600">
                            <FiDollarSign className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">الراتب المتوقع</p>
                            <p className="font-bold text-gray-900">{job.salary}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600">
                            <FiClock className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">نوع العمل</p>
                            <p className="font-bold text-gray-900">{job.type}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-left" dir="ltr">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600 ml-auto">
                            <FiInfo className="text-xl" />
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">نسبة التطابق</p>
                            <p className="font-bold text-blue-700">{job.matchScore}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    {/* Main Description */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FiBriefcase className="text-blue-600" />
                            الوصف الوظيفي
                        </h2>
                        <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                            {job.description}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FiCheck className="text-blue-600" />
                            المتطلبات والمهارات
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {job.requirements?.map((req: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-gray-700">
                                    <div className="mt-1 w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    </div>
                                    <span>{req}</span>
                                </li>
                            ))}
                            {(!job.requirements || job.requirements.length === 0) && (
                                <p className="text-gray-500 italic">لا توجد متطلبات محددة</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Action Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h3 className="font-bold text-gray-900 mb-4">اتخاذ إجراء</h3>
                        {!job.status ? (
                            <button
                                onClick={handleApply}
                                disabled={isApplying}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <FiCheck className="text-xl" />
                                {isApplying ? 'جاري التقديم...' : 'التقديم على هذه الوظيفة'}
                            </button>
                        ) : (
                            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-gray-600 mb-2">حالة طلبك:</p>
                                <p className="font-bold text-blue-700">
                                    {job.status === 'accepted' ? 'تم قبولك للوظيفة! تفقد المحادثات.' :
                                        job.status === 'rejected' ? 'تم رفض الطلب هذه المرة.' : 'طلبك قيد المراجعة حالياً.'}
                                </p>
                                {job.status === 'accepted' && (
                                    <Link
                                        href="/dashboard/messages"
                                        className="mt-4 block w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition"
                                    >
                                        بدء المحادثة
                                    </Link>
                                )}
                            </div>
                        )}

                        <Link
                            href="/dashboard/jobs"
                            className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-700 transition"
                        >
                            تصفح وظائف أخرى
                        </Link>
                    </div>

                    <div className="bg-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold mb-2">هل تعلم؟</h3>
                            <p className="text-blue-100 text-sm">
                                نسبة تطابقك مع هذه الوظيفة ({job.matchScore}%) تم حسابها بناءً على المهارات والخبرة في سيرتك الذاتية.
                            </p>
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500 rounded-full opacity-50 blur-2xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
