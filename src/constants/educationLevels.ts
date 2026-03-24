export const EDUCATION_LEVELS = [
  'ثانوية',
  'دبلوم',
  'بكالوريوس',
  'ماجستير',
  'دكتوراه'
] as const;

export type EducationLevel = typeof EDUCATION_LEVELS[number];
