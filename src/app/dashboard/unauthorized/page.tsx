'use client'

import { useRouter } from 'next/navigation'
import { FiAlertTriangle } from 'react-icons/fi'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <FiAlertTriangle className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          غير مصرح بالوصول
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ليس لديك صلاحية للوصول إلى هذه الصفحة.
          <br />
          يرجى التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    </div>
  )
}