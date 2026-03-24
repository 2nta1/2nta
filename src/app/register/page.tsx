'use client'

import Link from 'next/link'
import { FiUser, FiBriefcase, FiArrowRight } from 'react-icons/fi'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          إنشاء حساب جديد
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          اختر نوع الحساب الذي تريد إنشاءه
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/register/user"
              className="relative block border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-medium text-gray-900">حساب باحث عن عمل</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    ابحث عن فرص عمل تناسب مهاراتك وخبراتك
                  </p>
                </div>
                <div className="mr-auto text-gray-400">
                  <FiArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>

            <Link
              href="/register/company"
              className="relative block border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FiBriefcase className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-medium text-gray-900">حساب شركة</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    انشر الوظائف وابحث عن أفضل المواهب
                  </p>
                </div>
                <div className="mr-auto text-gray-400">
                  <FiArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                سجل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}