'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import Sidebar from '@/components/company/Sidebar'
import { useEffect } from 'react'

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession();
  console.log('CompanyLayout session:', session, 'status:', status);
  const router = useRouter()

  const [company, setCompany] = useState<{ name: string; image?: string | null } | null>(null);

  const fetchCompany = useCallback(async () => {
    const res = await fetch('/api/company/profile', { credentials: 'same-origin' });
    if (res.ok) {
      const data = await res.json();
      setCompany({ name: data.name, image: data.image });
    }
  }, []);

  useEffect(() => {
    fetchCompany();
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logoUrl={company?.image ?? undefined} companyName={company?.name ?? 'Company'} />
      <main className="flex-1">{children}</main>
    </div>
  )
}