export interface CV {
  id: string;
  userId: string;
  category: string;
  specialty: string;
  yearsExp: number;
  techSkills: string[];
  softSkills: string[];
  languages: string[];
}

export interface Job {
  id: string;
  category: string;
  specialty: string;
  requiredTech: string[];
  preferredSoft: string[];
  languages: string[];
  yearsMin: number;
}

export interface MatchedCandidate {
  cvId: string;
  userId: string;
  score: number;
  topMatchedSkills: string[];
}

// weights – later can be loaded from config or env
const WEIGHTS = {
  tech: 0.55,
  soft: 0.2,
  lang: 0.15,
  exp: 0.1,
};

function intersect<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return Array.from(new Set(a.filter((x) => setB.has(x))));
}

export function matchCandidates(job: Job, cvs: CV[]): MatchedCandidate[] {
  const normalize = (s: string) => s.trim().toLowerCase();

  const sameField = cvs.filter((cv) => {
    const catMatch = normalize(cv.category) === normalize(job.category);

    // لو إحدى القيم غير موجودة نعتبر التخصص متطابق
    if (!cv.specialty || !job.specialty) return catMatch;

    const cvSpec = normalize(cv.specialty);
    const jobSpec = normalize(job.specialty);

    const specMatch = cvSpec === jobSpec || cvSpec.includes(jobSpec) || jobSpec.includes(cvSpec);

    return catMatch && specMatch;
  });

  return sameField
    .map((cv) => {
      const techMatches = intersect(cv.techSkills, job.requiredTech);
      const softMatches = intersect(cv.softSkills, job.preferredSoft);
      const langMatches = intersect(cv.languages, job.languages);

      const scoreTech = job.requiredTech.length
        ? techMatches.length / job.requiredTech.length
        : 0;
      const scoreSoft = job.preferredSoft.length
        ? softMatches.length / job.preferredSoft.length
        : 0;
      const scoreLang = job.languages.length
        ? langMatches.length / job.languages.length
        : 0;
      const scoreExp = cv.yearsExp >= job.yearsMin ? 1 : 0;

      const score =
        WEIGHTS.tech * scoreTech +
        WEIGHTS.soft * scoreSoft +
        WEIGHTS.lang * scoreLang +
        WEIGHTS.exp * scoreExp;

      return {
        cvId: cv.id,
        userId: cv.userId,
        score: Number(score.toFixed(3)),
        topMatchedSkills: techMatches.slice(0, 5),
      } as MatchedCandidate;
    })
    .sort((a, b) => b.score - a.score);
}
