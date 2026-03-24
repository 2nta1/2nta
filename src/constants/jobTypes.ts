export const JOB_TYPES = [
  'دوام كامل',
  'دوام جزئي',
  'عن بعد',
  'متدرب',
  'مستقل'
] as const;

export type JobType = typeof JOB_TYPES[number];
