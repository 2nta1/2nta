export const WORKPLACES = [
  'مكتب',
  'عن بعد',
  'مختلط (مكتب و عن بعد)',
  'مصنع',
  'مطعم',
  'متجر',
  'مكتب طبي',
  'مكتب محاماة',
  'مكتب هندسي',
  'مكتب تصميم'
] as const;

export type Workplace = typeof WORKPLACES[number];
