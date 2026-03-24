'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { FiUser, FiCamera, FiPhone, FiCalendar, FiShield, FiLock, FiCheckCircle, FiShare2, FiFacebook, FiLinkedin } from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContext'

interface Settings {
  image?: string
  birthDate?: string
  phone?: string
  whatsapp?: string
  linkedin?: string
  facebook?: string
}

export default function SettingsPage() {
  const { t } = useLanguage()
  const router = useRouter();
  const [form, setForm] = useState<Settings | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  // load existing data
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/user/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setForm(data || {});
      } else {
        setForm({});
      }
    })();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const base64 = await toBase64(file);
    setForm(prev => ({ ...prev, image: base64 }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setSaving(false);
      if (res.ok) {
        toast.success(t('settings.success'));
        router.refresh();
      } else {
        toast.error(t('settings.error'));
      }
    } catch (err: any) {
      setSaving(false);
      toast.error(t('settings.connection_error'));
    }
  };

  if (!form) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between px-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('settings.title')}</h1>
        <div className="flex items-center gap-2 text-xs font-black text-green-600 bg-green-50/50 px-4 py-2 rounded-full border border-green-100/50 backdrop-blur-sm">
          <FiShield className="text-sm" />
          {t('settings.data_encrypted')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={submit} className="glass-card rounded-[3rem] overflow-hidden border-white/60 premium-shadow">
            <div className="p-10 space-y-10">
              {/* Photo Section */}
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100 ring-1 ring-slate-200/50">
                    {preview || form.image ? (
                      <img src={preview ?? form.image} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FiUser size={48} />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all border-4 border-white">
                    <FiCamera size={18} />
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{t('settings.personal_image')}</h3>
                  <p className="text-sm font-medium text-slate-400 max-w-xs">{t('settings.image_tip')}</p>
                </div>
              </div>

              <div className="h-px bg-slate-100/50" />

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <FiCalendar className="text-blue-500" /> {t('settings.birth_date')}
                  </label>
                  <input
                    type="date" name="birthDate" value={form.birthDate ?? ''} onChange={handleChange}
                    className="w-full h-14 px-5 bg-slate-50/50 border border-slate-200/50 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <FiPhone className="text-blue-500" /> {t('settings.phone')}
                  </label>
                  <input
                    type="text" name="phone" value={form.phone ?? ''} onChange={handleChange}
                    placeholder="+966 50 000 0000"
                    className="w-full h-14 px-5 bg-slate-50/50 border border-slate-200/50 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-8 pt-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                  <FiShare2 className="text-blue-500" /> {t('settings.social_links')}
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-blue-50/50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100/50 group-focus-within:bg-blue-600 group-focus-within:text-white transition-all">
                      <FiFacebook className="text-xl" />
                    </div>
                    <input
                      type="text" name="facebook" value={form.facebook ?? ''} onChange={handleChange}
                      placeholder="Facebook profile URL"
                      className="flex-1 h-14 px-5 bg-slate-50/50 border border-slate-200/50 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-indigo-50/50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100/50 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all">
                      <FiLinkedin className="text-xl" />
                    </div>
                    <input
                      type="text" name="linkedin" value={form.linkedin ?? ''} onChange={handleChange}
                      placeholder="LinkedIn profile URL"
                      className="flex-1 h-14 px-5 bg-slate-50/50 border border-slate-200/50 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-green-50/50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100/50 group-focus-within:bg-green-600 group-focus-within:text-white transition-all">
                      <FiShare2 className="text-xl" />
                    </div>
                    <input
                      type="text" name="whatsapp" value={form.whatsapp ?? ''} onChange={handleChange}
                      placeholder="WhatsApp number"
                      className="flex-1 h-14 px-5 bg-slate-50/50 border border-slate-200/50 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100/50 flex justify-end">
              <button
                type="submit" disabled={saving}
                className="px-12 py-4 btn-gradient text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {saving ? t('settings.saving') : t('settings.save_changes')}
              </button>
            </div>
          </form>
        </div>

        {/* Security Page Column */}
        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] border-white/60 premium-shadow p-8 overflow-hidden relative group">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('settings.security_privacy')}</h2>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <FiLock />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50/50 rounded-[1.5rem] border border-green-100/50 group/item hover:bg-green-50 transition-colors">
                  <FiCheckCircle className="text-green-500 text-2xl flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-black text-slate-900">{t('settings.account_verified')}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t('settings.email_verified')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-[1.5rem] border border-blue-100/50 group/item hover:bg-blue-50 transition-colors cursor-pointer">
                  <FiLock className="text-blue-600 text-2xl flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-black text-blue-600">{t('settings.change_password')}</p>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">{t('settings.password_updated')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100/50 opacity-60 group/item grayscale hover:grayscale-0 transition-all">
                  <FiShield className="text-slate-400 text-2xl flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-black text-slate-900">{t('settings.two_factor')}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t('settings.two_factor_desc')}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100/50" />

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('settings.profile_visibility')}</p>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 rounded-2xl transition-all cursor-pointer group/toggle border border-transparent hover:border-slate-100">
                  <span className="text-sm font-bold text-slate-700">{t('settings.public')}</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white premium-shadow relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiShield className="text-blue-400 text-2xl" />
              </div>
              <h3 className="text-lg font-black mb-2 leading-tight">{t('settings.security_tip_title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {t('settings.security_tip_desc')}
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
