import Link from 'next/link'
import { FaUserTie, FaBuilding } from 'react-icons/fa'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          اختر نوع الحساب
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/auth/user/login"
              className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaUserTie className="ml-2" />
              تسجيل دخول كمستخدم
            </Link>
            
            <Link
              href="/auth/company/login"
              className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <FaBuilding className="ml-2" />
              تسجيل دخول كشركة
            </Link>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{' '}
                <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  سجل الآن
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}