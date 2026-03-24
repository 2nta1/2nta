'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { FiUser, FiBriefcase, FiBook, FiAward, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CandidateProfilePage() {
    const params = useParams()
    const id = params?.id
    const { data: candidate, error, isLoading } = useSWR(id ? `/api/candidates/${id}` : null, fetcher)

    if (error) return (
        <div className="p-8 text-center">
            <p className="text-red-500">حدث خطأ في تحميل بيانات المرشح.</p>
            <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 block">العودة للرئيسية</Link>
        </div>
    )

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
    )

    const resume = candidate?.resume

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                    {candidate.name?.charAt(0) || <FiUser />}
                </div>
                <div className="flex-1 text-center md:text-right">
                    <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
                    <p className="text-lg text-gray-600 mt-1">{resume?.role || 'باحث عن عمل'}</p>
                    <div className="mt-4 flex flex-wrap justify-center md:justify-end gap-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {resume?.experience || 'خبرة غير محددة'}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {resume?.category} - {resume?.specialty}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Stats & Contact */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FiUser className="text-blue-600" />
                            معلومات التواصل
                        </h2>
                        <div className="space-y-3 text-gray-600">
                            <p><span className="font-medium text-gray-900">البريد:</span> {candidate.email}</p>
                            <p><span className="font-medium text-gray-900">الهاتف:</span> {candidate.phone || 'غير متاح'}</p>
                            <p><span className="font-medium text-gray-900">الموقع:</span> {resume?.city ? `${resume.city}, ${resume.country}` : 'غير محدد'}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FiAward className="text-blue-600" />
                            المهارات
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {resume?.skills?.map((skill: string) => (
                                <span key={skill} className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm">
                                    {skill}
                                </span>
                            )) || <p className="text-gray-400 text-sm">لا يوجد مهارات مسجلة</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Experience & Education */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                            <FiBriefcase className="text-blue-600" />
                            الخبرة المهنية
                        </h2>
                        {resume?.experience ? (
                            <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-line">
                                {resume.experience}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">لم يتم إدراج تفاصيل الخبرة</p>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                            <FiBook className="text-blue-600" />
                            التعليم والمؤهلات
                        </h2>
                        {resume?.education ? (
                            <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-line">
                                {resume.education}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">لم يتم إدراج تفاصيل التعليم</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <Link
                    href={`/dashboard/messages`}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    بدء المحادثة مع المرشح
                </Link>
            </div>
        </div>
    )
}
