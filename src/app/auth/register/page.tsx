'use client'

import Link from 'next/link'
import { FiUser, FiHome, FiArrowLeft, FiActivity, FiArrowRight } from 'react-icons/fi'

import { useLanguage } from '@/context/LanguageContext'

export default function RegisterTypePage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group" dir="ltr">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:rotate-12 transition-transform">
              <span className="font-black text-2xl">2</span>
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tighter">NTA</span>
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('auth.register_title')}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">{t('auth.register_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/auth/register/user"
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-primary transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors border border-blue-100">
              <FiUser className="text-3xl" />
            </div>
            <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors mb-2">{t('home.job_seeker')}</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">{t('auth.register_job_seeker_desc')}</p>

            <div className="mt-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
              <FiArrowRight className="text-xl" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/auth/register/company"
            className="group bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:bg-slate-800 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-white/10 text-blue-400 rounded-[1.5rem] flex items-center justify-center mb-6 border border-white/10">
              <FiHome className="text-3xl" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">{t('auth.company')}</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">{t('auth.register_employer_desc')}</p>

            <div className="mt-auto w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/30 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FiArrowRight className="text-xl" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        <div className="mt-10 text-center flex flex-col items-center gap-6">
          <Link href="/auth/login" className="text-slate-600 font-bold hover:text-primary transition-colors text-sm">
            {t('auth.have_account')} <span className="text-primary font-black hover:underline">{t('auth.login_button')}</span>
          </Link>

          <div className="flex items-center justify-center gap-4 text-slate-400">
            <Link href="/" className="text-xs font-bold hover:text-slate-600 flex items-center gap-1 transition-colors">
              <FiArrowLeft className="rotate-180 rtl:rotate-0" /> {t('common.back_to_home')}
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <p className="text-[10px] font-medium tracking-tight uppercase">{t('common.copyright')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}