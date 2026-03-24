'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiUser, FiHome, FiLock, FiMail, FiArrowLeft, FiActivity } from 'react-icons/fi'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [accountType, setAccountType] = useState<'user' | 'company'>('user')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useLanguage()

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'company') {
      setAccountType('company')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        type: accountType
      })

      if (result?.error) {
        setError(t('auth.login_error'))
        setLoading(false)
      } else {
        router.push(accountType === 'company' ? '/dashboard/company' : '/dashboard/user')
      }
    } catch (err) {
      setError(t('auth.generic_error'))
      setLoading(false)
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
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('auth.welcome_back')}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">{t('auth.login_desc')}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white p-8 md:p-10">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setAccountType('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${accountType === 'user'
                ? 'bg-white text-primary shadow-md'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <FiUser size={18} />
              {t('auth.user')}
            </button>
            <button
              type="button"
              onClick={() => setAccountType('company')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${accountType === 'company'
                ? 'bg-white text-primary shadow-md'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <FiHome size={18} />
              {t('auth.company')}
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                {t('auth.email')}
              </label>
              <div className="relative group">
                <FiMail className={`absolute ${locale === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors`} />
                <input
                  type="email"
                  required
                  className={`w-full h-14 ${locale === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50 focus:!border-primary`}
                  placeholder={t('auth.email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {t('auth.password')}
                </label>
                <a href="#" className="text-[10px] font-bold text-primary hover:underline">{t('auth.forgot_password')}</a>
              </div>
              <div className="relative group">
                <FiLock className={`absolute ${locale === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors`} />
                <input
                  type="password"
                  required
                  className={`w-full h-14 ${locale === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50 focus:!border-primary`}
                  placeholder={t('auth.password_placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-white text-lg font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiActivity className="text-blue-100" />
                  {t('auth.login_button')}
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {t('auth.not_have_account')} {' '}
              <Link
                href={`/auth/register?type=${accountType}`}
                className="text-primary font-black hover:underline"
              >
                {t('auth.register_now')}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-4 text-slate-400">
          <Link href="/" className="text-xs font-bold hover:text-slate-600 flex items-center gap-1 transition-colors">
            <FiArrowLeft className={locale === 'ar' ? 'rotate-180' : ''} /> {t('auth.back_to_home')}
          </Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <p className="text-[10px] font-medium tracking-tight uppercase">© 2026 {t('auth.copyright_platform')}</p>
        </div>
      </div>
    </div>
  )
}