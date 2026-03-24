export const EMP_TYPES = [
  'دوام كامل',
  'دوام جزئي',
  'عن بعد',
  'متدرب',
  'مستقل'
] as const;

export type EmploymentType = typeof EMP_TYPES[number];
