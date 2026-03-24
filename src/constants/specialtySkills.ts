export const SPECIALTY_SKILLS = [
  'تطوير تطبيقات الويب',
  'تطوير تطبيقات الموبايل',
  'تحليل البيانات',
  'الذكاء الاصطناعي',
  'الأمن السيبراني',
  'التصميم الجرافيكي',
  'إدارة المشاريع',
  'التسويق الرقمي',
  'تحليل الأعمال',
  'الموارد البشرية'
] as const;

export type SpecialtySkill = typeof SPECIALTY_SKILLS[number];
