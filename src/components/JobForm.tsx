"use client";

import { useState, useEffect, useRef } from "react";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { COUNTRIES, PROVINCES, REGIONS } from "@/constants/locations";
import { useLanguage } from "@/context/LanguageContext";
import { translateText } from '@/utils/categoryTranslations';
import { translateLocation } from '@/utils/locationTranslations';

// أنواع الوظائف
const JOB_TYPES = [
  'دوام كامل',
  'دوام جزئي',
  'عمل عن بعد',
  'عمل مؤقت',
  'عمل مرن'
] as const;
import { SKILLS, SPECIALTY_SKILLS } from "@/constants/skills";
import { EXTRA_TECH_SKILLS } from "@/constants/extraTechSkills";
import { COMMON_SOFT_SKILLS } from "@/constants/commonSoftSkills";
import { loadFullSkills } from "@/lib/loadSkills";
import { ALL_LANGUAGES } from "@/constants/allLanguages";
import { COMMON_BENEFITS } from "@/constants/benefits";
import { COMPANY_CULTURES } from "@/constants/cultures";
import { CAREER_PATHS } from "@/constants/careerPaths";

type Country = typeof COUNTRIES[number];

export type RatedSkill = { name: string; level: string | number };

export interface JobPayload {
  // --- job fields ---
  category?: string;
  specialty?: string;
  techSkills?: RatedSkill[];
  languages?: RatedSkill[];
  softSkills?: RatedSkill[];
  yearsExp?: string;
  jobType?: string;
  country?: string;
  province?: string;
  region?: string;
  salary?: string;
  workplace?: string;
  startDate?: string;
  deadline?: string;
  benefits?: string[];
  culture?: string;
  careerPath?: string;
  educationLevel?: string;
  graduationYear?: string;
  relocate?: boolean;
  employmentType?: string;
}

interface JobFormProps {
  initial?: Partial<JobPayload>;
  submitting: boolean;
  onSubmit: (payload: JobPayload) => void | Promise<void>;
}

/***********************
 * Constants           *
 ***********************/
// NOTE: Using COUNTRIES imported from constants/locations.ts to avoid duplication
// REGIONS constant is available from constants/locations.ts
const LANG_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const EDUCATION_LEVELS = {
  HIGH_SCHOOL: 'ثانوية عامة',
  DIPLOMA: 'دبلوم',
  BACHELOR: 'بكالوريوس',
  MASTER: 'ماجستير',
  PHD: 'دكتوراه'
};
const WORKPLACES = ["مكتب", "عن بُعد", "هجين"];
const YEARS_OPTIONS = ["متدرب", "1-3 سنوات", "3-5 سنوات", "10+ سنوات"];
// مستويات الخبرة العامة
const EXPERIENCE_LEVELS = ["مبتدئ", "متوسط", "متقدم", "خبير"];
// نطاقات الرواتب التقريبية (يمكن تعديلها لاحقاً)
const SALARY_RANGES = [
  "أقل من 5000",
  "5000 - 10000",
  "10000 - 20000",
  "20000 - 50000",
  "50000 - 100000"
];

/***********************
 * Main Component      *
 ***********************/
export default function JobForm({ initial = {}, submitting, onSubmit }: JobFormProps) {
  /* ---------- i18n ---------- */
  const { t, locale } = useLanguage();

  /* ---------- translated constants ---------- */
  const JOB_TYPES_LOCALIZED = [
    t('job_form.full_time'),
    t('job_form.part_time'),
    t('job_form.remote'),
    t('job_form.temporary'),
    t('job_form.flexible')
  ];

  const EDUCATION_LEVELS_LOCALIZED = {
    HIGH_SCHOOL: t('job_form.high_school'),
    DIPLOMA: t('job_form.diploma'),
    BACHELOR: t('job_form.bachelor'),
    MASTER: t('job_form.master'),
    PHD: t('job_form.phd')
  };

  const WORKPLACES_LOCALIZED = [
    t('job_form.office'),
    t('job_form.remote_work'),
    t('job_form.hybrid')
  ];

  const YEARS_OPTIONS_LOCALIZED = [
    t('job_form.intern'),
    t('job_form.years_1_3'),
    t('job_form.years_3_5'),
    t('job_form.years_10_plus')
  ];

  const EXPERIENCE_LEVELS_LOCALIZED = [
    t('job_form.beginner'),
    t('job_form.intermediate'),
    t('job_form.advanced'),
    t('job_form.expert')
  ];

  const SALARY_RANGES_LOCALIZED = [
    t('job_form.less_5k'),
    t('job_form.range_5_10k'),
    t('job_form.range_10_20k'),
    t('job_form.range_20_50k'),
    t('job_form.range_50_100k')
  ];

  /* ---------- state ---------- */
  // ---------- additional job fields ----------
  const [category, setCategory] = useState((initial as any).category || "");
  const [specialty, setSpecialty] = useState((initial as any).specialty || "");
  const [techSkills, setTechSkills] = useState<RatedSkill[]>((initial as any).techSkills || []);
  const [languages, setLanguages] = useState<RatedSkill[]>((initial as any).languages || []);
  const [softSkills, setSoftSkills] = useState<RatedSkill[]>((initial as any).softSkills || []);

  const [jobType, setJobType] = useState((initial as any).jobType || "");
  const [country, setCountry] = useState<Country>((initial as any).country || "");
  const [province, setProvince] = useState((initial as any).province || "");
  const [region, setRegion] = useState((initial as any).region || "");
  const [salary, setSalary] = useState((initial as any).salary || "");
  const [yearsExp, setYearsExp] = useState((initial as any).yearsExp || "");
  const [workplace, setWorkplace] = useState((initial as any).workplace || "");
  const [startDate, setStartDate] = useState((initial as any).startDate || "");
  const [deadline, setDeadline] = useState((initial as any).deadline || "");
  const [benefits, setBenefits] = useState<string[]>((initial as any).benefits || []);
  const [culture, setCulture] = useState((initial as any).culture || "");
  const [careerPath, setCareerPath] = useState((initial as any).careerPath || "");
  const [educationLevel, setEducationLevel] = useState((initial as any).educationLevel || "");
  const [graduationYear, setGraduationYear] = useState((initial as any).graduationYear || "");

  /* ---------- load full skills ---------- */
  const [full, setFull] = useState<Record<string, any>>({});
  const [remoteSkills, setRemoteSkills] = useState<string[]>([]);
  useEffect(() => {
    loadFullSkills().then(setFull);
  }, []);

  // reset specialty & selected skills when category changes AFTER first load
  const prevCat = useRef<string | undefined>();
  useEffect(() => {
    if (prevCat.current !== undefined && prevCat.current !== category) {
      setSpecialty('');
      setTechSkills([]);
    }
    prevCat.current = category;
  }, [category]);

  useEffect(() => {
    if (!category) {
      setRemoteSkills([]);
      return;
    }
    fetch(`/api/skills?category=${encodeURIComponent(category)}`)
      .then(r => r.json())
      .then(d => setRemoteSkills(Array.isArray(d.skills) ? d.skills : []))
      .catch(() => setRemoteSkills([]));
  }, [category]);

  /* ---------- options ---------- */
  const specKey = specialty.trim();
  const techOpts: string[] = Array.from(new Set([
    ...(full[specKey]?.tech || []),
    ...(SPECIALTY_SKILLS[specKey]?.tech || []),
    ...(SKILLS[category]?.tech || []),
    ...(EXTRA_TECH_SKILLS[category] || []),
    ...remoteSkills,
  ]));

  const provinceOpts = PROVINCES[country] || [];

  const langOpts: string[] = [
    ...(full[specKey]?.languages || []),
    ...(SPECIALTY_SKILLS[specKey]?.languages || []),
    ...(SKILLS[category]?.languages || []),
    ...ALL_LANGUAGES,
  ];
  const softOpts: string[] = [
    ...(full[specKey]?.soft || []),
    ...(SPECIALTY_SKILLS[specKey]?.soft || []),
    ...(SKILLS[category]?.soft || []),
    ...COMMON_SOFT_SKILLS,
  ];

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: JobPayload = {
      category,
      specialty,
      techSkills,
      languages,
      softSkills,
      jobType,
      country,
      province,
      region,
      salary,
      yearsExp,
      workplace,
      startDate,
      deadline,
      benefits,
      culture,
      careerPath,
      educationLevel,
      graduationYear,
    };

    await onSubmit(payload);
  };

  /* ---------- JSX ---------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* المجال والتخصص */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.field')} *</label>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setSpecialty(''); }} className="w-full border p-2 rounded" required>
            <option value="">{t('job_form.choose_category')}</option>
            {JOB_CATEGORIES.map(c => (
              <option key={c.label} value={c.label}>
                {translateText(c.label, locale as 'ar' | 'en')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('job_form.specialty')} *</label>
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full border p-2 rounded" required>
            <option value="">{t('job_form.choose_specialty')}</option>
            {JOB_CATEGORIES.find(c => c.label === category)?.specialties.map(s => (
              <option key={s} value={s}>
                {translateText(s, locale as 'ar' | 'en')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* المؤهل العلمي وسنة التخرج */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.required_qualification')} *</label>
          <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className="w-full border p-2 rounded" required>
            <option value="">{t('job_form.choose_education')}</option>
            {Object.entries(EDUCATION_LEVELS_LOCALIZED).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('job_form.grad_year')} *</label>
          <select value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} className="w-full border p-2 rounded" required>
            <option value="">{t('job_form.choose_year')}</option>
            {Array.from({ length: 10 }, (_, i) => {
              const startYear = new Date().getFullYear() - (i * 5) - 4;
              const endYear = new Date().getFullYear() - (i * 5);
              const range = `${startYear} - ${endYear}`;
              return (
                <option key={range} value={range}>
                  {range}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* المهارات */}
      <SkillsSection title={t('job_form.tech_skills')} options={techOpts} list={techSkills} toggle={setTechSkills} />
      {/* اللغات */}
      <LanguagesSection options={langOpts} list={languages} toggle={setLanguages} />
      {/* المهارات السلوكية */}
      <SkillsSection title={t('job_form.soft_skills')} options={softOpts} list={softSkills} toggle={setSoftSkills} />

      {/* الخبرة ونوع العمل */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.years_exp')} *</label>
          <select value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} className="w-full border p-2 rounded" required>
            <option value="">{t('job_form.choose_level')}</option>
            {YEARS_OPTIONS_LOCALIZED.map((l, i) => <option key={i}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('job_form.job_type')} *</label>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full border p-2 rounded" required>
            <option value="">{t('job_form.choose_level')}</option>
            {JOB_TYPES_LOCALIZED.map((type, i) => <option key={i}>{type}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('job_form.required_qualification')}</label>
          <select
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
            name="educationLevel"
            className="w-full border p-2 rounded"
          >
            <option value="">{t('job_form.choose_education')}</option>
            {Object.entries(EDUCATION_LEVELS_LOCALIZED).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.grad_year')}</label>
          <select
            value={graduationYear || ''}
            onChange={(e) => setGraduationYear(e.target.value)}
            name="graduationYear"
            className="w-full border p-2 rounded"
          >
            <option value="">{t('job_form.choose_year')}</option>
            {Array.from({ length: 10 }, (_, i) => {
              const startYear = new Date().getFullYear() - (i * 5) - 4;
              const endYear = new Date().getFullYear() - (i * 5);
              const range = `${startYear} - ${endYear}`;
              return (
                <option key={range} value={range}>
                  {range}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* الموقع والراتب */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.country')} *</label>
          <select value={country} onChange={(e) => {
            const newCountry = e.target.value as Country;
            setCountry(newCountry);
            setProvince('');
            setRegion('');
          }} className="w-full border p-2 rounded" required>
            <option value="">{t('job_form.choose_country')}</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{translateLocation(c, locale as 'ar' | 'en')}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('job_form.province')} *</label>
          <select value={province} onChange={(e) => {
            setProvince(e.target.value);
            setRegion('');
          }} className="w-full border p-2 rounded" required disabled={!country}>
            <option value="">{country ? t('job_form.choose_province') : t('job_form.choose_country')}</option>
            {provinceOpts.map(p => <option key={p} value={p}>{translateLocation(p, locale as 'ar' | 'en')}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('job_form.region')}</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full border p-2 rounded" disabled={!province}>
            <option value="">{province ? t('job_form.choose_region') : t('job_form.choose_province')}</option>
            {(REGIONS[province] || []).map(r => <option key={r} value={r}>{translateLocation(r, locale as 'ar' | 'en')}</option>)}
          </select>
        </div>
      </div>

      {/* الراتب */}
      <div>
        <label className="block mb-1">{t('job_form.salary_range')}</label>
        <select value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full border p-2 rounded">
          <option value="">{t('job_form.choose_level')}</option>
          {SALARY_RANGES_LOCALIZED.map((r, i) => <option key={i}>{r}</option>)}
        </select>
      </div>

      {/* تفاصيل إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.years_exp')}</label>
          <select value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} className="w-full border p-2 rounded">
            <option value="">{t('job_form.choose_level')}</option>
            {YEARS_OPTIONS_LOCALIZED.map((o, i) => <option key={i}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('job_form.workplace')}</label>
          <select value={workplace} onChange={(e) => setWorkplace(e.target.value)} className="w-full border p-2 rounded">
            <option value="">{t('job_form.choose_level')}</option>
            {WORKPLACES_LOCALIZED.map((w, i) => <option key={i}>{w}</option>)}
          </select>
        </div>
      </div>

      {/* المواعيد */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.start_date')}</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">{t('job_form.deadline')}</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full border p-2 rounded" />
        </div>
      </div>

      {/* مزايا الشركة */}
      <BenefitSection options={COMMON_BENEFITS} list={benefits} toggle={setBenefits} />

      {/* الثقافة والمسار */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.culture')}</label>
          <select value={culture} onChange={(e) => setCulture(e.target.value)} className="w-full border p-2 rounded">
            <option value="">{t('job_form.choose_culture')}</option>
            {COMPANY_CULTURES.map(c => (
              <option key={c}>{translateText(c, locale as 'ar' | 'en')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('job_form.career_path')}</label>
          <select value={careerPath} onChange={(e) => setCareerPath(e.target.value)} className="w-full border p-2 rounded">
            <option value="">{t('job_form.choose_career_path')}</option>
            {CAREER_PATHS.map(p => (
              <option key={p}>{translateText(p, locale as 'ar' | 'en')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* زر الحفظ */}
      <div className="flex justify-end">
        <button disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded">
          {submitting ? t('job_form.submit') + '...' : t('job_form.submit')}
        </button>
      </div>
    </form>
  );
}

/***********************
 * Subcomponents        *
 ***********************/
function SkillsSection({ title, options, list, toggle }: { title: string; options: string[]; list: RatedSkill[]; toggle: (v: RatedSkill[]) => void }) {
  const { t, locale } = useLanguage();
  const [custom, setCustom] = useState('');
  const remaining = options.filter(o => !list.find(s => s.name === o));
  return (
    <div className="my-4">
      <label className="block font-medium mb-1">{title}</label>
      <select className="w-full border p-2 rounded" value="" onChange={(e) => { const val = e.target.value; if (!val) return; toggle([...list, { name: val, level: 50 }]); }}>
        <option value="">{t('job_form.choose_skills')}</option>
        {remaining.map(opt => (
          <option key={opt} value={opt}>
            {translateText(opt, locale as 'ar' | 'en')}
          </option>
        ))}
      </select>
      {list.length > 0 && (
        <ul className="mt-2 list-disc list-inside space-y-1">
          {list.map(s => (
            <li key={s.name} className="flex justify-between items-center">
              <span>{translateText(s.name, locale as 'ar' | 'en')}</span>
              <button type="button" onClick={() => toggle(list.filter(x => x.name !== s.name))} className="text-red-500 text-sm">{t('common.delete')}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BenefitSection({ options, list, toggle }: { options: string[]; list: string[]; toggle: (v: string[]) => void }) {
  const { t, locale } = useLanguage();
  const remaining = options.filter((o) => !list.includes(o));
  return (
    <div className="my-4">
      <label className="block font-medium mb-1">{t('job_form.benefits')}</label>
      <select
        className="w-full border p-2 rounded"
        value=""
        onChange={(e) => {
          const v = e.target.value;
          if (!v) return;
          toggle([...list, v]);
        }}
      >
        <option value="">{t('job_form.choose_benefits')}</option>
        {remaining.map((opt) => (
          <option key={opt} value={opt}>
            {translateText(opt, locale as 'ar' | 'en')}
          </option>
        ))}
      </select>
      {list.length > 0 && (
        <ul className="mt-2 list-disc list-inside space-y-1">
          {list.map((b) => (
            <li key={b} className="flex justify-between items-center">
              <span>{translateText(b, locale as 'ar' | 'en')}</span>
              <button
                type="button"
                onClick={() => toggle(list.filter((x) => x !== b))}
                className="text-red-500 text-sm"
              >
                {t('common.delete')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LanguagesSection({ options, list, toggle }: { options: string[]; list: RatedSkill[]; toggle: (v: RatedSkill[]) => void }) {
  const { t, locale } = useLanguage();
  // إزالة التكرار داخل قائمة اللغات
  const uniqueOptions = Array.from(new Set(options));
  const remaining = uniqueOptions.filter(o => !list.find(s => s.name === o));
  // Translate language levels
  const nativeLevelText = locale === 'ar' ? 'لغة أم' : 'Native';
  const levels = [nativeLevelText, ...LANG_LEVELS];
  const updateLevel = (name: string, level: string) => {
    toggle(list.map(l => l.name === name ? { ...l, level } : l));
  };
  return (
    <div className="my-4">
      <label className="block font-medium mb-1">{t('job_form.languages_label')}</label>
      <select className="w-full border p-2 rounded" value="" onChange={(e) => { const v = e.target.value; if (!v) return; toggle([...list, { name: v, level: nativeLevelText }]); }}>
        <option value="">{t('job_form.choose_lang')}</option>
        {remaining.map(opt => <option key={opt}>{opt}</option>)}
      </select>
      {list.length > 0 && (
        <ul className="mt-2 space-y-2">
          {list.map(l => (
            <li key={l.name} className="flex items-center space-x-2 rtl:space-x-reverse">
              <span>{l.name}</span>
              <select value={l.level as any} onChange={(e) => updateLevel(l.name, e.target.value)} className="border p-1 rounded text-sm">
                {levels.map(lv => <option key={lv}>{lv}</option>)}
              </select>
              <button type="button" onClick={() => toggle(list.filter(x => x.name !== l.name))} className="text-red-500 text-xs">{t('common.delete')}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

