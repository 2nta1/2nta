'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaUserTie, FaBuilding, FaRocket, FaCheckCircle, FaShieldAlt } from 'react-icons/fa'
import { FiArrowRight, FiPlay, FiBriefcase, FiUsers } from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContext'
import { motion } from 'framer-motion'

export default function Home() {
  const { t, locale } = useLanguage()

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 lg:py-20 px-4 overflow-hidden bg-[#F8FAFC]">
      {/* Dynamic Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="relative max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-6 space-y-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 glass-card border-blue-200/50 text-blue-600 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm">
            <FaRocket className="text-blue-500" />
            {t('home.hero_badge')}
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] text-slate-900 tracking-tight">
              {t('home.hero_title_1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {t('home.hero_title_2')}
              </span>
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
              {t('home.hero_desc')}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-600/80">
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/50 rounded-xl border border-white/80 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <FaCheckCircle className="text-xs" />
              </div>
              {t('home.benefit_fast')}
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/50 rounded-xl border border-white/80 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                <FaCheckCircle className="text-xs" />
              </div>
              {t('home.benefit_smart')}
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/50 rounded-xl border border-white/80 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <FaShieldAlt className="text-xs" />
              </div>
              {t('home.benefit_secure')}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all hover:scale-[1.03] shadow-xl flex items-center justify-center gap-3"
            >
              <FiPlay className="fill-white" />
              {t('home.watch_demo') || 'Watch Demo'}
            </button>
            <div className="flex -space-x-3 items-center ml-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                </div>
              ))}
              <div className="pl-6 text-sm font-black text-slate-400">
                +10k Users Joined
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Visual Group */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:col-span-6 relative flex flex-col gap-6"
        >
          {/* Main Hero Visual (Floating) */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] -z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />

          {/* Action Cards with Images */}
          <div className="grid grid-cols-1 gap-8 relative z-10">
            {/* Job Seeker Card */}
            <Link
              href="/auth/login?type=user"
              className="group glass-card p-4 rounded-[2.5rem] premium-shadow border-white/80 hover:scale-[1.02] transition-all duration-500 flex flex-col md:flex-row gap-6 relative overflow-hidden"
            >
              <div className="w-full md:w-52 h-44 rounded-[1.75rem] overflow-hidden relative shrink-0 shadow-lg border border-white/40">
                <Image
                  src="/images/landing/job-seeker.png"
                  alt="Job Seeker"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/60 to-transparent mix-blend-multiply opacity-40" />
              </div>
              <div className="flex flex-col justify-center flex-1 space-y-4 pr-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                    <FiBriefcase className="text-xl" />
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm ${locale === 'ar' ? '' : 'rotate-180'}`}>
                    <FiArrowRight className="text-xl" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{t('home.job_seeker')}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{t('home.job_seeker_desc')}</p>
                </div>
              </div>
              <div className="absolute bottom-[-10%] right-[-5%] w-32 h-32 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-colors" />
            </Link>

            {/* Employer Card */}
            <Link
              href="/auth/login?type=company"
              className="group glass-card !bg-slate-900/95 p-4 rounded-[2.5rem] shadow-2xl shadow-slate-900/40 hover:scale-[1.02] transition-all duration-500 flex flex-col md:flex-row gap-6 relative overflow-hidden border border-white/10"
            >
              <div className="w-full md:w-52 h-44 rounded-[1.75rem] overflow-hidden relative shrink-0 shadow-xl border border-white/5">
                <Image
                  src="/images/landing/employer.png"
                  alt="Employer"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent mix-blend-multiply opacity-60" />
              </div>
              <div className="flex flex-col justify-center flex-1 space-y-4 pr-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center border border-white/10">
                    <FiUsers className="text-xl" />
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg ${locale === 'ar' ? '' : 'rotate-180'}`}>
                    <FiArrowRight className="text-xl" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">{t('home.employer')}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('home.employer_desc')}</p>
                </div>
              </div>
              <div className="absolute bottom-[-10%] right-[-5%] w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-colors" />
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex justify-center"
            >
              <p className="text-slate-400 text-sm font-bold flex items-center gap-2">
                {t('common.not_have_account')}
                <Link href="/auth/register" className="text-blue-600 font-black hover:text-blue-700 hover:underline underline-offset-8 transition-all px-2 py-1 bg-blue-50 rounded-lg">
                  {t('common.join_us')}
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Abstract Hero Background Element (Visual only) */}
          <div className="absolute -z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] opacity-[0.4]">
            <Image src="/images/landing/hero.png" fill className="object-contain mix-blend-screen opacity-60" alt="" />
          </div>
        </motion.div>
      </div>

      {/* Floating Trusted By Label */}
      <div className="mt-20 mb-32 flex flex-col items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 underline underline-offset-8 decoration-slate-200">
          Trusted by Industry Leaders
        </p>
        <div className="flex flex-wrap justify-center gap-12 text-2xl text-slate-400">
          <div className="font-black italic">TECH-CORP</div>
          <div className="font-black tracking-tighter">GLOBAL BANK</div>
          <div className="font-black underline decoration-4">INNOVATE</div>
          <div className="font-serif">CREATIVE.CO</div>
        </div>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full max-w-7xl px-4 py-24 relative">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t('home.how_it_works')}</h2>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-10" />

          {[1, 2, 3].map((step) => (
            <motion.div
              key={step}
              whileHover={{ y: -10 }}
              className="glass-card p-10 rounded-[3rem] text-center space-y-6 relative border-white/80"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center text-2xl font-black mx-auto shadow-xl shadow-blue-200/50">
                {step}
              </div>
              <h3 className="text-xl font-black text-slate-900">{t(`home.step_${step}_title`)}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {t(`home.step_${step}_desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}