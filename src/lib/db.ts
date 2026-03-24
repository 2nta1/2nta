// Temporary in-memory mock DB until real database integrated.
// In production replace these with DB drivers (Prisma, Supabase, etc.)

import { CV, Job } from './matchCandidates';

// ------- mock data ---------
const mockCVs: CV[] = [
  {
    id: 'cv1',
    userId: 'user1',
    category: 'تقنية المعلومات',
    specialty: 'تطوير تطبيقات الويب',
    yearsExp: 3,
    techSkills: ['جافاسكريبت', 'React', 'Node.js'],
    softSkills: ['التواصل', 'العمل الجماعي'],
    languages: ['English', 'العربية'],
  },
  {
    id: 'cv2',
    userId: 'user2',
    category: 'تقنية المعلومات',
    specialty: 'تطوير تطبيقات الويب',
    yearsExp: 5,
    techSkills: ['TypeScript', 'React', 'Next.js'],
    softSkills: ['حل المشكلات'],
    languages: ['English'],
  },
];

const mockJobs: Job[] = [
  {
    id: 'job1',
    category: 'تقنية المعلومات',
    specialty: 'تطوير تطبيقات الويب',
    requiredTech: ['React', 'TypeScript', 'Next.js'],
    preferredSoft: ['التواصل'],
    languages: ['English'],
    yearsMin: 2,
  },
];

// ------- API helpers ---------
export async function getAllCVs(): Promise<CV[]> {
  // replace with DB query
  return mockCVs;
}

export async function getJobById(id: string): Promise<Job | null> {
  // replace with DB query
  return mockJobs.find((j) => j.id === id) ?? null;
}
