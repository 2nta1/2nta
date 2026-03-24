"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { SKILLS, SPECIALTY_SKILLS } from "@/constants/skills";
import { EXTRA_TECH_SKILLS } from "@/constants/extraTechSkills";
import { COMMON_SOFT_SKILLS } from "@/constants/commonSoftSkills";
import { loadFullSkills } from "@/lib/loadSkills";
import { ALL_LANGUAGES } from "@/constants/allLanguages";
import { useLanguage } from "@/context/LanguageContext";
import { translateText } from "@/utils/categoryTranslations";
import { translateConstant, WORKPLACE_TRANS, EXPERIENCE_TRANS, SOFT_SKILLS_TRANS } from "@/utils/cvTranslations";

/* ---------- types ---------- */
export type RatedSkill = { name: string; level: string | number };

export interface SkillsSectionProps {
  techSkills: RatedSkill[];
  languages: RatedSkill[];
  softSkills: RatedSkill[];
  techOptions: string[];
  onTechSkillsChange: (skills: RatedSkill[]) => void;
  onLanguagesChange: (languages: RatedSkill[]) => void;
  onSoftSkillsChange: (softSkills: RatedSkill[]) => void;
}

export interface WorkProfilePayload {
  category?: string;
  specialty?: string;
  techSkills?: RatedSkill[];
  softSkills?: RatedSkill[];
  languages?: RatedSkill[];
  experience?: string;
  workplacePreference?: string;
  salaryExpectation?: string;
}

interface UserWorkFormProps {
  initial?: Partial<WorkProfilePayload>;
  submitting?: boolean;
  onSubmit: (payload: WorkProfilePayload) => void | Promise<void>;
}

/***********************
 * Constants           *
 ***********************/
const LANG_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const WORKPLACES = ["مكتب", "عن بُعد", "هجين"];
const EXPERIENCE_LEVELS = ["مبتدئ", "متوسط", "متقدم", "خبير"];
const SALARY_OPTIONS = [
  "< 5000",
  "5000 - 10000",
  "10000 - 20000",
  "20000 - 50000",
  "> 50000",
];

/***********************
 * Component           *
 ***********************/
export default function UserWorkForm({ initial = {}, submitting = false, onSubmit }: UserWorkFormProps) {
  const { t, locale } = useLanguage();
  /* ---------- state ---------- */
  const [category, setCategory] = useState(initial.category || "");
  const [specialty, setSpecialty] = useState(initial.specialty || "");
  const [techSkills, setTechSkills] = useState<RatedSkill[]>(initial.techSkills || []);
  const [softSkills, setSoftSkills] = useState<RatedSkill[]>(initial.softSkills || []);
  const [languages, setLanguages] = useState<RatedSkill[]>(initial.languages || []);
  const [experience, setExperience] = useState(initial.experience || "");
  const [workplacePreference, setWorkplacePreference] = useState(initial.workplacePreference || "");
  const [salaryExpectation, setSalaryExpectation] = useState(initial.salaryExpectation || "");

  /* ---------- skills sources ---------- */
  const [full, setFull] = useState<Record<string, any>>({});
  const [remoteSkills, setRemoteSkills] = useState<string[]>([]);
  useEffect(() => {
    loadFullSkills().then(setFull);
  }, []);

  // reset specialty + tech skills when category changes
  useEffect(() => {
    setSpecialty("");
    setTechSkills([]);
  }, [category]);

  useEffect(() => {
    if (!category) return;
    fetch(`/api/skills?category=${encodeURIComponent(category)}`)
      .then(r => r.ok ? r.json() : [])
      .then(setRemoteSkills)
      .catch(() => setRemoteSkills([]));
  }, [category]);

  /* ---------- helpers ---------- */
  const techOpts = Array.from(
    new Set([
      ...(full[category]?.tech || []),
      ...(SPECIALTY_SKILLS[specialty]?.tech || []),
      ...Object.values(SKILLS).flatMap(g => g.tech),
      ...Object.values(EXTRA_TECH_SKILLS).flatMap(arr => arr),
      ...remoteSkills,
    ])
  );
  const softOpts = COMMON_SOFT_SKILLS;
  const langOpts = ALL_LANGUAGES;

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: WorkProfilePayload = {
      category,
      specialty,
      techSkills,
      softSkills,
      languages,
      experience,
      workplacePreference,
      salaryExpectation,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* القطاع والتخصص */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.field')} *</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border p-2 rounded" required>
            <option value="">{t('job_form.choose_field')}</option>
            {JOB_CATEGORIES.map(c => <option key={c.label} value={c.label}>{translateText(c.label, locale as 'ar' | 'en')}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('job_form.specialty')} *</label>
          <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full border p-2 rounded" required>
            <option value="">{t('job_form.choose_specialty')}</option>
            {JOB_CATEGORIES.find(c => c.label === category)?.specialties.map(s => <option key={s} value={s}>{translateText(s, locale as 'ar' | 'en')}</option>)}
          </select>
        </div>
      </div>

      {/* المهارات */}
      <SkillsSection
        techSkills={techSkills || []}
        languages={languages || []}
        softSkills={softSkills || []}
        techOptions={techOpts}
        onTechSkillsChange={setTechSkills}
        onLanguagesChange={setLanguages}
        onSoftSkillsChange={setSoftSkills}
      />
      <LanguagesSection
        languages={languages}
        onLanguagesChange={setLanguages}
      />

      {/* خبرة ومكان عمل وراتب */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-1">{t('job_form.experience_level')}</label>
          <select value={experience} onChange={e => setExperience(e.target.value)} className="w-full border p-2 rounded">
            <option value="">{t('job_form.choose_level')}</option>
            {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{translateConstant(l, EXPERIENCE_TRANS, locale as 'ar' | 'en')}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('cv.preferred_workplace')}</label>
          <select value={workplacePreference} onChange={e => setWorkplacePreference(e.target.value)} className="w-full border p-2 rounded">
            <option value="">{t('cv.choose_city')}</option>
            {/* Note: Reuse choose_city or create choose_workplace? choose_city is "Choose City". UserWorkForm had "اختر" (Choose). I will use choose_city as placeholder? No, let's use job_form.choose_level (generic choose) or add choose_workplace. 
               UserWorkForm used "اختر" (Choose). 
               Let's use t('common.select') or just empty string? 
               Wait, line 168 was "اختر". 
               I will assume "Choose" is generic. But I don't have a generic "Choose" key. 
               `cv.preferred_workplace` is "Preferred Workplace".
               I'll use `job_form.workplace` label.
               Placeholder: I'll use `job_form.choose_level` which is "Choose Level"/"اختر المستوى" - bad.
               I'll use `t('job_form.workplace')` as label.
               Placeholder: "Select..." -> `t('common.select')` (if exists). 
               I'll just use "..." or reuse `job_form.choose_field`? No.
               Dictionary: `job_form.workplace` exists ("Workplace").
            */
            }
            {WORKPLACES.map(w => <option key={w} value={w}>{translateConstant(w, WORKPLACE_TRANS, locale as 'ar' | 'en')}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('cv.expected_salary')}</label>
          <select value={salaryExpectation} onChange={e => setSalaryExpectation(e.target.value)} className="w-full border p-2 rounded">
            <option value="">{t('job_form.salary_range')}</option>
            {SALARY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* زر الحفظ */}
      <div className="flex justify-end">
        <button disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded">
          {submitting ? t('settings.saving') : t('job_form.submit')}
        </button>
      </div>
    </form>
  );
}

/***********************
 * Subcomponents        *
 ***********************/
export const SkillsSection: React.FC<SkillsSectionProps> = ({ techSkills, languages, softSkills, techOptions, onTechSkillsChange, onLanguagesChange, onSoftSkillsChange }) => {
  const { t, locale } = useLanguage()
  const techInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* Tech Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('cv.tech_skills')}</label>
        <div className="mt-1">
          <div className="flex gap-2">
            <input
              ref={techInputRef}
              type="text"
              list="tech-options"
              placeholder={t('cv.add_skill_placeholder')}
              className="flex-1 p-2 border rounded"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value;
                  if (val && !techSkills.find(s => s.name === val)) {
                    onTechSkillsChange([...techSkills, { name: val, level: 'متوسط' }]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <datalist id="tech-options">
              {techOptions.filter(o => !techSkills.find(s => s.name === o)).map(opt => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={() => {
                if (techInputRef.current) {
                  const val = techInputRef.current.value;
                  if (val && !techSkills.find(s => s.name === val)) {
                    onTechSkillsChange([...techSkills, { name: val, level: 'متوسط' }]);
                    techInputRef.current.value = '';
                  }
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {t('cv.add')}
            </button>
          </div>
          {techSkills.length > 0 && (
            <ul className="mt-2 list-disc list-inside space-y-1">
              {techSkills.map(skill => (
                <li key={skill.name} className="flex justify-between items-center">
                  <span>{skill.name}</span>
                  <button type="button" onClick={() => onTechSkillsChange(techSkills.filter(s => s.name !== skill.name))} className="text-red-500 text-sm">{t('cv.delete')}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('cv.languages')}</label>
        <div className="mt-1">
          {languages.length > 0 && (
            <ul className="mt-2 space-y-2">
              {languages.map(l => (
                <li key={l.name} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span>{l.name}</span>
                  <select value={l.level as any} onChange={(e) => onLanguagesChange(languages.map(lang => lang.name === l.name ? { ...lang, level: e.target.value } : lang))} className="border p-1 rounded text-sm">
                    {[t('cv.native_language'), ...LANG_LEVELS].map(lv => <option key={lv}>{lv}</option>)}
                  </select>
                  <button type="button" onClick={() => onLanguagesChange(languages.filter(x => x.name !== l.name))} className="text-red-500 text-xs">{t('cv.delete')}</button>
                </li>
              ))}
            </ul>
          )}
          <select
            className="w-full border p-2 rounded mt-2"
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              onLanguagesChange([...languages, { name: val, level: 'B1' }]);
            }}
          >
            <option value="">{t('cv.choose_language')}</option>
            {ALL_LANGUAGES.filter(l => !languages.find(x => x.name === l)).map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('cv.soft_skills')}</label>
        <div className="mt-1">
          {softSkills.length > 0 && (
            <ul className="mt-2 list-disc list-inside space-y-1">
              {softSkills.map((skill) => (
                <li key={skill.name} className="flex justify-between items-center">
                  <span>{translateConstant(skill.name, SOFT_SKILLS_TRANS, locale as 'ar' | 'en')} <span className="text-xs text-gray-500">({skill.level})</span></span>
                  <button
                    type="button"
                    onClick={() => onSoftSkillsChange(softSkills.filter((s) => s.name !== skill.name))}
                    className="text-red-500 text-sm"
                  >
                    {t('cv.delete')}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <select
            className="w-full p-2 border rounded mt-2"
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              onSoftSkillsChange([...softSkills, { name: val, level: 'متوسط' }]);
            }}
          >
            <option value="">{t('cv.choose_soft_skill')}</option>
            {COMMON_SOFT_SKILLS.filter((s) => !softSkills.find((x) => x.name === s)).map((opt) => (
              <option key={opt} value={opt}>{translateConstant(opt, SOFT_SKILLS_TRANS, locale as 'ar' | 'en')}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function LanguagesSection({ languages, onLanguagesChange }: { languages: RatedSkill[]; onLanguagesChange: (languages: RatedSkill[]) => void }) {
  const { t, locale } = useLanguage();
  const handleLanguagesChange = (languages: RatedSkill[]) => {
    onLanguagesChange(languages);
  };

  const updateLevel = (name: string, level: string) => {
    handleLanguagesChange(languages.map(l => l.name === name ? { ...l, level } : l));
  };

  const levels = [t('cv.native_language'), ...LANG_LEVELS];
  const uniqueLanguages = Array.from(new Set(ALL_LANGUAGES));
  const remaining = uniqueLanguages.filter(lang => !languages.find(s => s.name === lang));

  return (
    <div className="my-4">
      <label className="block font-medium mb-1">اللغات</label>
      <select
        className="w-full border p-2 rounded"
        value=""
        onChange={e => {
          const language = e.target.value as string;
          if (!language) return;
          handleLanguagesChange([...languages, { name: language, level: 'B2' }]);
        }}
      >
        <option value="">اختر اللغة</option>
        {remaining.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
      {languages.length > 0 && (
        <ul className="mt-2 space-y-2">
          {languages.map(l => (
            <li key={l.name} className="flex items-center space-x-2 rtl:space-x-reverse">
              <span>{l.name}</span>
              <select value={l.level as any} onChange={(e) => updateLevel(l.name, e.target.value)} className="border p-1 rounded text-sm">
                {levels.map(lv => <option key={lv}>{lv}</option>)}
              </select>
              <button type="button" onClick={() => handleLanguagesChange(languages.filter(x => x.name !== l.name))} className="text-red-500 text-xs">حذف</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
