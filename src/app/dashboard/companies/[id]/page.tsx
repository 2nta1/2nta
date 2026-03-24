'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { FiMapPin, FiGlobe, FiBriefcase, FiUsers, FiClock } from 'react-icons/fi'
import PostCard from '@/components/company/PostCard'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function PublicCompanyProfilePage() {
    const params = useParams()
    const id = params?.id
    const { data: company, error, isLoading } = useSWR(id ? `/api/companies/${id}` : null, fetcher)

    if (error) return (
        <div className="p-8 text-center">
            <p className="text-red-500">حدث خطأ في تحميل بيانات الشركة.</p>
            <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 block">العودة للرئيسية</Link>
        </div>
    )

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Hero / Cover */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 rounded-t-2xl shadow-inner relative">
                <div className="absolute -bottom-12 right-8 flex items-end gap-6">
                    <div className="w-32 h-32 bg-white rounded-2xl shadow-lg border-4 border-white overflow-hidden relative">
                        {company.image ? (
                            <Image src={company.image} alt={company.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
                                {company.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="pb-4">
                        <h1 className="text-3xl font-bold text-white drop-shadow-sm">{company.name}</h1>
                        <p className="text-blue-100">{company.industry || 'قطاع غير محدد'}</p>
                    </div>
                </div>
            </div>

            <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {/* Sidebar: Details */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold mb-4 text-gray-900">حول الشركة</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {company.description || 'لا يوجد وصف متاح لهذه الشركة حالياً.'}
                        </p>

                        <hr className="my-6 border-gray-100" />

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <FiMapPin className="text-blue-500" />
                                <span>{company.location || company.city || 'موقع غير محدد'}</span>
                            </div>
                            {company.website && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FiGlobe className="text-blue-500" />
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">الموقع الإلكتروني</a>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-gray-600">
                                <FiUsers className="text-blue-500" />
                                <span>{company.companySize || 'حجم الشركة غير محدد'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold mb-4 text-gray-900">الوظائف المتاحة</h2>
                        <div className="space-y-3">
                            {company.jobs?.length > 0 ? (
                                company.jobs.map((job: any) => (
                                    <Link
                                        key={job.id}
                                        href={`/dashboard/jobs/${job.id}`}
                                        className="block p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition"
                                    >
                                        <h3 className="font-bold text-gray-900 text-sm">{job.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            <FiClock />
                                            <span>منذ {new Date(job.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm italic">لا توجد وظائف معلنة حالياً</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Feed: Posts */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 px-2">آخر المنشورات</h2>
                    <div className="space-y-6">
                        {company.posts?.length > 0 ? (
                            company.posts.map((post: any) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
                                <FiBriefcase className="mx-auto text-4xl text-gray-300 mb-4" />
                                <p className="text-gray-500">لم تقم الشركة بنشر أي تحديثات بعد.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
