'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FiHome, FiMail, FiLock, FiUser, FiPhone, FiGlobe, FiArrowRight, FiActivity, FiLayers, FiBriefcase } from 'react-icons/fi'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { translateText } from '@/utils/categoryTranslations';

export default function CompanyRegisterPage() {
  const { t, locale } = useLanguage()
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactPerson: '',
    phone: '',
    website: '',
    description: '',
    commercialNumber: '',
    companySize: '',
    industry: ''
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const companySizes = [
    { value: 'SMALL', label: { en: '1-50 Employees', ar: '1-50 موظف' } },
    { value: 'MEDIUM', label: { en: '51-200 Employees', ar: '51-200 موظف' } },
    { value: 'LARGE', label: { en: '201-500 Employees', ar: '201-500 موظف' } },
    { value: 'ENTERPRISE', label: { en: 'More than 500 Employees', ar: 'أكثر من 500 موظف' } }
  ]

  const industries = [
    'تكنولوجيا المعلومات',
    'التجارة الإلكترونية',
    'الخدمات المالية',
    'التعليم',
    'الرعاية الصحية',
    'التصنيع',
    'التجزئة',
    'الضيافة',
    'البناء',
    'أخرى'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.password_mismatch'))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.companyName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          contactPerson: formData.contactPerson.trim(),
          phone: formData.phone.trim(),
          website: formData.website?.trim() || undefined,
          description: formData.description?.trim() || undefined,
          commercialNumber: formData.commercialNumber.trim(),
          companySize: formData.companySize,
          industry: formData.industry,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || data.message || t('auth.register_error'))
      router.push('/auth/login?type=company&registered=true')
    } catch (err: any) {
      setError(err.message || t('auth.create_error'))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group" dir="ltr">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:rotate-12 transition-transform">
              <span className="font-black text-2xl">2</span>
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tighter">NTA</span>
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('auth.create_company_account')}</h2>
          <p className="text-slate-500 mt-2 text-sm">{t('auth.company_desc')}</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-white p-8 md:p-12">
          {error && (
            <div className="mb-8 bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-5 rounded-2xl flex items-center gap-3">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t('auth.basic_info')}</h3>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1">{t('auth.company_name')}</label>
                  <div className="relative group">
                    <FiHome className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                    <input
                      name="companyName" type="text" required
                      className="w-full h-12 pr-12 pl-6 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50"
                      placeholder={t('auth.company_name')}
                      value={formData.companyName} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1">{t('auth.work_email')}</label>
                  <div className="relative group">
                    <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                    <input
                      name="email" type="email" required
                      className="w-full h-12 pr-12 pl-6 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50"
                      placeholder={t('auth.email_placeholder')}
                      value={formData.email} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 px-1">{t('auth.password')}</label>
                    <div className="relative group">
                      <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                      <input
                        name="password" type="password" required minLength={8}
                        className="w-full h-12 pr-12 pl-4 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                        placeholder={t('auth.password_placeholder')}
                        value={formData.password} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 px-1">{t('auth.confirm_password')}</label>
                    <div className="relative group">
                      <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                      <input
                        name="confirmPassword" type="password" required minLength={8}
                        className="w-full h-12 pr-12 pl-4 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                        placeholder={t('auth.password_placeholder')}
                        value={formData.confirmPassword} onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t('auth.business_info')}</h3>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1">{t('auth.contact_person')}</label>
                  <div className="relative group">
                    <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                    <input
                      name="contactPerson" type="text" required
                      className="w-full h-12 pr-12 pl-6 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                      placeholder={t('auth.contact_person')}
                      value={formData.contactPerson} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1">{t('auth.phone')}</label>
                  <div className="relative group">
                    <FiPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
                    <input
                      name="phone" type="tel" required
                      className="w-full h-12 pr-12 pl-6 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                      placeholder="+966 50 000 0000"
                      value={formData.phone} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1">{t('auth.commercial_number')}</label>
                  <input
                    name="commercialNumber" type="text" required
                    className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                    placeholder={t('auth.commercial_number')}
                    value={formData.commercialNumber} onChange={handleChange}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1 flex items-center gap-2">
                    <FiLayers className="text-primary" /> {t('auth.company_size')}
                  </label>
                  <select
                    name="companySize" required
                    className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                    value={formData.companySize} onChange={handleChange}
                  >
                    <option value="">{t('auth.choose_size')}</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>{size.label[locale]}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1 flex items-center gap-2">
                    <FiBriefcase className="text-primary" /> {t('auth.industry')}
                  </label>
                  <select
                    name="industry" required
                    className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                    value={formData.industry} onChange={handleChange}
                  >
                    <option value="">{t('auth.choose_industry')}</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{translateText(industry, locale as 'ar' | 'en')}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1 flex items-center gap-2">
                    <FiGlobe className="text-primary" /> {t('auth.website')}
                  </label>
                  <input
                    name="website" type="url"
                    className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                    placeholder="https://example.com"
                    value={formData.website} onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1">{t('auth.company_brief')}</label>
                  <textarea
                    name="description" rows={3}
                    className="w-full p-5 bg-slate-50 border-slate-200 rounded-[2rem] text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
                    placeholder={t('auth.description_placeholder')}
                    value={formData.description} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full h-16 bg-primary text-white text-xl font-black rounded-3xl shadow-2xl shadow-blue-500/30 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiActivity className="text-blue-100" />
                  {t('auth.register_company_btn')}
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link href="/auth/register" className="text-slate-400 font-bold hover:text-primary transition-colors text-sm flex items-center justify-center gap-2">
              <FiArrowRight /> {t('auth.back_to_type')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}