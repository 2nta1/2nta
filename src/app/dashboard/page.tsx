'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // إذا كان الحساب شركة، حوّل مباشرةً إلى لوحة الشركة
  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role === 'COMPANY') {
      router.replace('/dashboard/company');
    }
  }, [status, session, router]);

  // للمستخدم العادي حوّل مباشرةً لصفحة السيرة الذاتية
  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role === 'USER') {
      router.replace('/dashboard/user');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return null;
}