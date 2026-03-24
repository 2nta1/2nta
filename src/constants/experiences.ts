export const EXPERIENCES = [
  'بدون خبرة',
  'أقل من سنة',
  '1-2 سنوات',
  '2-3 سنوات',
  '3-5 سنوات',
  '5-7 سنوات',
  '7-10 سنوات',
  'أكثر من 10 سنوات'
] as const;

export type Experience = typeof EXPERIENCES[number];
