'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FiHome, FiLock, FiMail, FiArrowLeft, FiActivity, FiUser } from 'react-icons/fi'
import Link from 'next/link'

export default function CompanyLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        redirect: false, email, password, type: 'company'
      })

      if (result?.error) {
        setError('بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى')
        setLoading(false)
      } else {
        router.push('/dashboard/company')
      }
    } catch (err) {
      setError('حدث خطأ في الخادم. يرجى المحاولة لاحقاً')
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
            لوحة تحكم الشركات
          </h2>
          <p className="text-slate-500 mt-2 text-sm">سجل دخولك لإدارة وظائفك والعثور على المواهب.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white p-8 md:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">البريد الإلكتروني للشركة</label>
              <div className="relative group">
                <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email" required
                  className="w-full h-14 pr-12 pl-6 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50 group-focus-within:border-primary"
                  placeholder="name@company.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">كلمة المرور</label>
                <a href="#" className="text-[10px] font-bold text-primary hover:underline">نسيت كلمة المرور؟</a>
              </div>
              <div className="relative group">
                <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="password" required
                  className="w-full h-14 pr-12 pl-6 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full h-14 bg-slate-900 text-white text-lg font-black rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiHome className="text-blue-400" />
                  دخول الشركات
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-50 text-center space-y-4">
            <p className="text-slate-500 text-sm font-medium">
              ليس لديك حساب شركة؟ {' '}
              <Link href="/auth/register/company" className="text-primary font-black hover:underline">سجل شركتك الآن</Link>
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/login" className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                <FiUser /> دخول المستخدمين
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-4 text-slate-400">
          <Link href="/" className="text-xs font-bold hover:text-slate-600 flex items-center gap-1 transition-colors">
            <FiArrowLeft className="rotate-180" /> العودة للرئيسية
          </Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <p className="text-[10px] font-medium tracking-tight uppercase">© ٢٠٢٦ منصة 2NTA للتوظيف</p>
        </div>
      </div>
    </div>
  )
}