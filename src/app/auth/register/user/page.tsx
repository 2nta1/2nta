'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FiUser, FiMail, FiLock, FiArrowRight, FiActivity } from 'react-icons/fi'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function UserRegisterPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.password_mismatch'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          type: 'user'
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || t('auth.register_error'))
      router.push('/auth/login?registered=true')
    } catch (err: any) {
      setError(err.message || t('auth.create_error'))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group" dir="ltr">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:rotate-12 transition-transform">
              <span className="font-black text-2xl">2</span>
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tighter">NTA</span>
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('auth.create_user_account')}</h2>
          <p className="text-slate-500 mt-2 text-sm">{t('auth.start_journey')}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white p-8 md:p-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-600" />
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('auth.full_name')}</label>
              <div className="relative group">
                <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                <input
                  type="text" required
                  className="w-full h-12 pr-12 pl-6 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50"
                  placeholder={t('auth.name_placeholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('auth.email')}</label>
              <div className="relative group">
                <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                <input
                  type="email" required
                  className="w-full h-12 pr-12 pl-6 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50"
                  placeholder={t('auth.email_placeholder')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('auth.password')}</label>
                <div className="relative group">
                  <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                  <input
                    type="password" required minLength={6}
                    className="w-full h-12 pr-12 pl-4 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                    placeholder={t('auth.password_placeholder')}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('auth.confirm_password')}</label>
                <div className="relative group">
                  <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                  <input
                    type="password" required minLength={6}
                    className="w-full h-12 pr-12 pl-4 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                    placeholder={t('auth.password_placeholder')}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full h-14 bg-primary text-white text-lg font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiActivity className="text-blue-100" />
                  {t('auth.create_account')}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/auth/register" className="text-slate-400 font-bold hover:text-primary transition-colors text-xs flex items-center justify-center gap-2">
              <FiArrowRight /> {t('auth.back_to_type')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}