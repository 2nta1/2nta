"use client";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { FiBriefcase, FiMapPin, FiAward, FiGlobe, FiCpu, FiMessageCircle, FiActivity, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { COUNTRIES, PROVINCES } from "@/constants/locations";
import { SKILLS } from "@/constants/skills";
import { SPECIALTY_SKILLS } from "@/constants/specialtySkills";
import { EXTRA_TECH_SKILLS } from "@/constants/extraTechSkills";
import { EXPERIENCES } from "@/constants/experiences";
import { JOB_TYPES, JobType } from "@/constants/jobTypes";
import { EDUCATION_LEVELS, EducationLevel } from "@/constants/educationLevels";
import { WORKPLACES, Workplace } from "@/constants/workplaces";
import { EMP_TYPES, EmploymentType } from "@/constants/employmentTypes";
import { SkillsSection, RatedSkill } from "@/components/UserWorkForm";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { translateConstant, WORKPLACE_TRANS, EDUCATION_TRANS, EMP_TYPE_TRANS, EXPERIENCE_TRANS, CAREER_PATH_TRANS } from "@/utils/cvTranslations";
import { translateText } from '@/utils/categoryTranslations';
import { translateLocation } from '@/utils/locationTranslations';

export type JobPayload = {
  category: string; specialty: string;
  techSkills: RatedSkill[]; softSkills: RatedSkill[]; languages: RatedSkill[];
  yearsExp: string; jobType: JobType;
  country: string; province: string;
  salary: string; workplace: Workplace;
  startDate: string; deadline: string;
  benefits: string[]; culture: string; careerPath: string;
  educationLevel: EducationLevel; graduationYear: string;
  relocate: boolean; employmentType: EmploymentType;
};

export default function CvForm() {
  const { t, locale } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [discovered, setDiscovered] = useState<{ type: string; value: string; parent: string | null }[]>([]);

  const [form, setForm] = useState<JobPayload>({
    category: '', specialty: '', techSkills: [], languages: [], softSkills: [],
    yearsExp: '', jobType: 'دوام كامل', country: '', province: '',
    salary: '', workplace: 'مكتب', startDate: '', deadline: '',
    benefits: [], culture: '', careerPath: '',
    educationLevel: 'بكالوريوس', graduationYear: '', relocate: false,
    employmentType: 'دوام كامل'
  });

  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [showOtherSpecialty, setShowOtherSpecialty] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customSpecialty, setCustomSpecialty] = useState('');

  useEffect(() => {
    fetch('/api/constants/discovered').then(res => res.json()).then(data => setDiscovered(data || []));
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      fetch('/api/user/resume')
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setForm({
            ...form, ...data,
            techSkills: data.techSkills || [],
            languages: data.languages || [],
            softSkills: data.softSkills || []
          });
          setLoading(false);
        }).catch(() => setLoading(false));
    }
  }, [status]);

  const buildTechOptions = (category: string, specialty: string) => {
    const baseTech = (SKILLS as Record<string, any>)[category]?.tech ?? [];
    const extraTech = EXTRA_TECH_SKILLS[category] ?? [];
    const specTech = SPECIALTY_SKILLS[specialty]?.tech ?? [];
    const discoveredTech = discovered.filter(d => d.type === 'SKILL' && (d.parent === specialty || d.parent === category)).map(d => d.value);
    const combined = [...baseTech, ...extraTech, ...specTech, ...discoveredTech];
    if (combined.length) return Array.from(new Set(combined));
    return Array.from(new Set(Object.values(SKILLS).flatMap(g => g.tech)));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'category') {
      if (value === 'OTHER') { setShowOtherCategory(true); setForm(prev => ({ ...prev, category: '' })); }
      else { setShowOtherCategory(false); setForm(prev => ({ ...prev, category: value })); }
      return;
    }
    if (name === 'specialty') {
      if (value === 'OTHER') { setShowOtherSpecialty(true); setForm(prev => ({ ...prev, specialty: '' })); }
      else { setShowOtherSpecialty(false); setForm(prev => ({ ...prev, specialty: value })); }
      return;
    }
    setForm(prev => ({ ...prev, [name]: name === 'relocate' ? (e.target as HTMLInputElement).value === 'نعم' : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, category: showOtherCategory ? customCategory : form.category, specialty: showOtherSpecialty ? customSpecialty : form.specialty };
      const res = await fetch('/api/user/resume', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || t('cv.save_error'));
      }
      toast.success(t('cv.save_success'));
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || t('cv.save_error'));
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-4">
            <FiAward /> {t('cv.job_seeker_profile')}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            {t('cv.smart_cv')}
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </h1>
          <p className="text-slate-500 mt-2 font-medium">{t('cv.accuracy_tip')}</p>
        </div>
        <button
          onClick={handleSubmit} disabled={saving}
          className="px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FiCheckCircle /> {t('cv.save_cv')}</>}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Essential Section */}
        <div className="glass-card rounded-[2.5rem] premium-shadow border-white/60 p-8 md:p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FiBriefcase />
            </div>
            {t('cv.specialization_experience')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.main_specialty')}</label>
              <select
                name="category" value={showOtherCategory ? 'OTHER' : form.category} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50"
              >
                <option value="">{t('cv.choose_main_specialty')}</option>
                {JOB_CATEGORIES.map(cat => <option key={cat.label} value={cat.label}>{translateText(cat.label, locale as 'ar' | 'en')}</option>)}
                {discovered.filter(d => d.type === 'CATEGORY').map(d => <option key={d.value} value={d.value}>{d.value} {t('cv.new')}</option>)}
                <option value="OTHER">{t('cv.other_manual')}</option>
              </select>
              {showOtherCategory && (
                <input
                  type="text" placeholder={t('cv.enter_specialty')}
                  className="mt-2 w-full h-12 px-5 bg-blue-50 border-blue-200 rounded-2xl text-slate-900 font-bold"
                  value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} required
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.sub_specialty')}</label>
              <select
                name="specialty" value={showOtherSpecialty ? 'OTHER' : form.specialty} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all !bg-slate-50"
              >
                <option value="">{t('cv.choose_sub_specialty')}</option>
                {(JOB_CATEGORIES.find(c => c.label === form.category)?.specialties || []).map(s => <option key={s} value={s}>{translateText(s, locale as 'ar' | 'en')}</option>)}
                {discovered.filter(d => d.type === 'SPECIALTY' && d.parent === form.category).map(d => <option key={d.value} value={d.value}>{d.value} {t('cv.new')}</option>)}
                <option value="OTHER">{t('cv.other_manual')}</option>
              </select>
              {showOtherSpecialty && (
                <input
                  type="text" placeholder={t('cv.enter_sub_specialty')}
                  className="mt-2 w-full h-12 px-5 bg-blue-50 border-blue-200 rounded-2xl text-slate-900 font-bold"
                  value={customSpecialty} onChange={(e) => setCustomSpecialty(e.target.value)} required
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.years_experience')}</label>
              <select
                name="yearsExp" value={form.yearsExp} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                <option value="">{t('cv.choose_years_experience')}</option>
                {EXPERIENCES.map(exp => <option key={exp} value={exp}>{translateConstant(exp, EXPERIENCE_TRANS, locale as 'ar' | 'en')}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.career_path')}</label>
              <select
                name="careerPath" value={form.careerPath} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                <option value="">{t('cv.choose_career_path')}</option>
                {['تقني', 'إداري', 'قيادي', 'إبداعي', 'أكاديمي'].map(p => <option key={p} value={p}>{translateConstant(p, CAREER_PATH_TRANS, locale as 'ar' | 'en')}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="glass-card rounded-[2.5rem] premium-shadow border-white/60 p-8 md:p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <FiCpu />
            </div>
            {t('cv.skills_languages')}
          </h2>
          <SkillsSection
            techOptions={buildTechOptions(form.category, form.specialty)}
            techSkills={form.techSkills}
            languages={form.languages}
            softSkills={form.softSkills}
            onTechSkillsChange={(skills: RatedSkill[]) => setForm(prev => ({ ...prev, techSkills: skills }))}
            onLanguagesChange={(langs: RatedSkill[]) => setForm(prev => ({ ...prev, languages: langs }))}
            onSoftSkillsChange={(skills: RatedSkill[]) => setForm(prev => ({ ...prev, softSkills: skills }))}
          />
        </div>

        {/* Location & Prefs */}
        <div className="glass-card rounded-[2.5rem] premium-shadow border-white/60 p-8 md:p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <FiMapPin />
            </div>
            {t('cv.location_preferences')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.country')}</label>
              <select
                name="country" value={form.country} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                <option value="">{t('cv.choose_country')}</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{translateLocation(c, locale as 'ar' | 'en')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.city')}</label>
              <select
                name="province" value={form.province} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                <option value="">{t('cv.choose_city')}</option>
                {(PROVINCES[form.country as keyof typeof PROVINCES] || []).map(p => <option key={p} value={p}>{translateLocation(p, locale as 'ar' | 'en')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.relocate')}</label>
              <select
                name="relocate" value={form.relocate ? 'نعم' : 'لا'} onChange={handleChange}
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                <option value="نعم">{t('cv.yes')}</option>
                <option value="لا">{t('cv.no')}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.expected_salary')}</label>
              <select
                name="salary" value={form.salary} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                <option value="">{t('cv.choose_salary')}</option>
                {['3-5', '5-10', '10-20', '20-30', '30-50', '50-100'].map(r => <option key={r} value={r}>{r} {t('cv.thousands')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.preferred_workplace')}</label>
              <select
                name="workplace" value={form.workplace} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                {WORKPLACES.map(w => <option key={w} value={w}>{translateConstant(w, WORKPLACE_TRANS, locale as 'ar' | 'en')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.employment_type')}</label>
              <select
                name="employmentType" value={form.employmentType} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                {EMP_TYPES.map(t => <option key={t} value={t}>{translateConstant(t, EMP_TYPE_TRANS, locale as 'ar' | 'en')}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="glass-card rounded-[2.5rem] premium-shadow border-white/60 p-8 md:p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <FiAward />
            </div>
            {t('cv.education')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.education_level')}</label>
              <select
                name="educationLevel" value={form.educationLevel} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{translateConstant(e, EDUCATION_TRANS, locale as 'ar' | 'en')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('cv.graduation_year')}</label>
              <select
                name="graduationYear" value={form.graduationYear} onChange={handleChange} required
                className="w-full h-12 px-5 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all !bg-slate-50"
              >
                <option value="">{t('cv.choose_grad_year')}</option>
                {Array.from({ length: 11 }, (_, i) => {
                  const y = 2025 - (i * 5);
                  return <option key={y} value={`${y - 4}-${y}`}>{y - 4} - {y}</option>
                })}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            type="submit" disabled={saving}
            className="px-16 py-5 bg-primary text-white text-xl font-black rounded-3xl shadow-2xl shadow-blue-500/40 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-4 group"
          >
            {saving ? <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" /> : (
              <>
                <FiActivity className="text-blue-100 group-hover:rotate-12 transition-transform" />
                {t('cv.update_cv')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
