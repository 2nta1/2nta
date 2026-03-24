import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

import fs from 'fs';
import path from 'path';

// Helper function to get userId from session
async function getUserIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return null
  }
  return session.user.id
}

// Allowed resume fields list for sanitising input
const ALLOWED_FIELDS = [
  // original
  'category',
  'careerPath',
  'role',
  'experience',
  'jobLevel',
  'education',
  'languages',
  'skills',
  'softSkills',
  'workType',
  'country',
  'city',
  'expectedSalary',
  'relocate',
  'employmentType',
  // extended to support new UI fields
  'specialty',
  'techSkills',
  'yearsExp',
  'workplace',
  'province',
  'salary',

  'educationLevel',
  'graduationYear',
  'region',
] as const;

type ResumeField = typeof ALLOWED_FIELDS[number];

// allow any JSON-serialisable value for new flexible fields (techSkills etc.)
type ResumeBody = {
  [K in ResumeField]: any;
};

// Type guard for string fields
type StringField = 'category' | 'careerPath' | 'role' | 'experience' | 'jobLevel' | 'education' | 'workType' | 'country' | 'city' | 'employmentType' | 'specialty';
// Type guard for array fields
type ArrayField = 'languages' | 'skills' | 'softSkills';
// Type guard for boolean field
type BooleanField = 'relocate';

// Required fields with role
// Required fields with role
const requiredFields = ['category', 'careerPath', 'experience', 'jobLevel', 'education', 'workType', 'country', 'city', 'employmentType'] as const;

// Add role validation
async function validateResumeData(body: ResumeBody) {
  // Validate required fields
  const missingFields = requiredFields.filter(field => !(field in body));
  if (missingFields.length > 0) {
    return { error: `الحقول المطلوبة التالية مفقودة: ${missingFields.join(', ')}` };
  }

  // Validate string fields
  const stringFields = requiredFields.filter(field => typeof body[field] === 'string') as StringField[];
  for (const field of stringFields) {
    if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
      return { error: `الحقل ${field} يجب أن يكون نصاً غير فارغ` };
    }
  }

  return null;
}

// Helper to unpack rated skills stored as "name:level" into {name, level}
function unpackRatedSkills(arr: string[] | null | undefined): any[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((s) => {
    const [name, level] = s.split(':');
    return { name, level };
  });
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: 'unauth' }, { status: 401 });

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({}, { status: 200 });

  // Transform to match frontend structure
  const response = {
    ...resume,
    techSkills: unpackRatedSkills(resume.skills),
    languages: unpackRatedSkills(resume.languages),
    softSkills: unpackRatedSkills(resume.softSkills),
    yearsExp: resume.experience,
    workplace: resume.workType,
    province: resume.city,
    salary: resume.expectedSalary,
    jobType: resume.jobLevel,
    educationLevel: resume.education,
    graduationYear: resume.graduationYear,
    employmentType: resume.employmentType,
  } as any;

  return NextResponse.json(response);
}

function packRatedSkills(arr: any[]): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((s) => `${s.name}:${s.level}`);
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: 'unauth' }, { status: 401 });

  const body: ResumeBody = await req.json() as any;
  console.log('Resume POST Body:', JSON.stringify(body, null, 2));

  // --- Pre-transform front-end field names to DB equivalents before validation ---
  if ('yearsExp' in body) {
    body.experience = body.yearsExp;
  }
  if ('jobType' in body) {
    body.jobLevel = body.jobType;
  }
  if ('workplace' in body) {
    body.workType = body.workplace;
  }
  if ('province' in body) {
    body.city = body.province;
  }
  if ('salary' in body) {
    body.expectedSalary = body.salary;
  }
  if ('educationLevel' in body) {
    body.education = body.educationLevel;
  }

  // Ensure non-null Prisma columns have at least empty strings
  const obligatoryStringCols = ['region', 'careerPath', 'role', 'workType', 'country', 'city'] as const;
  for (const col of obligatoryStringCols) {
    if (!(col in body) || body[col as ResumeField] === undefined) {
      (body as any)[col] = '';
    }
  }

  // graduationYear is now a string to support ranges
  // graduationYear is now a string to support ranges
  if (!('graduationYear' in body) || body.graduationYear === undefined) {
    (body as any).graduationYear = '';
  }

  // ---- Skip strict required field validation to allow draft saving ----
  const validationErrors: string[] = [];

  // Validate boolean fields
  const booleanFields = ['relocate'] as const;
  for (const field of booleanFields) {
    const fieldValue = body[field as ResumeField];
    if (field in body && typeof fieldValue !== 'boolean') {
      validationErrors.push(`الحقل ${field} يجب أن يكون من نوع boolean`);
    }
  }

  // Validate array fields (allow array of any serialisable)
  const arrayFields = ['languages', 'skills', 'softSkills', 'techSkills'] as const;
  for (const field of arrayFields) {
    const fieldValue = body[field as ResumeField];
    if (field in body && !Array.isArray(fieldValue)) {
      validationErrors.push(`الحقل ${field} يجب أن يكون مصفوفة`);
    }
  }

  if (validationErrors.length > 0) {
    return NextResponse.json({
      error: validationErrors.join('\n')
    }, { status: 400 });
  }

  // Transform front-end fields to DB columns first
  if ('techSkills' in body) {
    body.skills = packRatedSkills(body.techSkills as any[]);
    delete (body as any).techSkills;
  }
  if ('languages' in body && Array.isArray(body.languages)) {
    body.languages = packRatedSkills(body.languages as any[]);
  }
  if ('softSkills' in body && Array.isArray(body.softSkills)) {
    body.softSkills = packRatedSkills(body.softSkills as any[]);
  }
  if ('yearsExp' in body) {
    body.experience = body.yearsExp;
    delete (body as any).yearsExp;
  }
  if ('jobType' in body) {
    body.jobLevel = body.jobType;
    delete (body as any).jobType;
  }

  if ('workplace' in body) {
    body.workType = body.workplace;
    delete (body as any).workplace;
  }
  if ('province' in body) {
    body.city = body.province;
    delete (body as any).province;
  }
  if ('salary' in body) {
    body.expectedSalary = body.salary;
    delete (body as any).salary;
  }
  if ('educationLevel' in body) {
    body.education = body.educationLevel;
    delete (body as any).educationLevel;
  }

  // Sanitise
  const data: any = {};
  for (const field of ALLOWED_FIELDS) {
    const fieldValue = body[field as ResumeField];
    if (fieldValue !== undefined) {
      if (typeof fieldValue === 'string') {
        data[field] = fieldValue.trim();
      } else if (Array.isArray(fieldValue)) {
        // احتفظ بالمصفوفة كما هي سواء كانت عناصرها نصوصاً أو كائنات (مثل techSkills)
        data[field] = fieldValue;
      } else {
        data[field] = fieldValue;
      }
    }
  }

  // --- Dynamic Constant Learning Logic ---
  try {
    const discoveredEntries = [];

    // 1. Learn Category
    if (data.category) {
      discoveredEntries.push({
        type: 'CATEGORY',
        value: data.category,
        parent: null
      });
    }

    // 2. Learn Specialty
    if (data.specialty && data.category) {
      discoveredEntries.push({
        type: 'SPECIALTY',
        value: data.specialty,
        parent: data.category
      });
    }

    // 3. Learn Tech Skills
    if (Array.isArray(body.techSkills)) {
      for (const skill of body.techSkills as any[]) {
        if (skill.name) {
          discoveredEntries.push({
            type: 'SKILL',
            value: skill.name,
            parent: data.specialty || data.category || null
          });
        }
      }
    }

    // Perform upserts for each discovered entry
    for (const entry of discoveredEntries) {
      await prisma.discoveredConstant.upsert({
        where: {
          type_value_parent: {
            type: entry.type,
            value: entry.value,
            parent: entry.parent
          }
        },
        create: {
          type: entry.type,
          value: entry.value,
          parent: entry.parent,
          count: 1,
          isApproved: false
        },
        update: {
          count: { increment: 1 }
        }
      });
    }
  } catch (learnErr) {
    console.error('Learning logic error (non-fatal):', learnErr);
    // Continue even if learning fails
  }

  try {
    const resume = await prisma.resume.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });

    // --- Reverse Matching: Find existing jobs for this new/updated resume ---
    try {
      const jobs = await prisma.job.findMany({
        where: {
          category: resume.category,
          specialty: resume.specialty,
        }
      });

      const matchesToCreate = [];
      const resumeLanguages = (resume.languages || []).map((l: string) => l.split(':')[0].toLowerCase());

      for (const job of jobs) {
        let score = 40; // Base score for Category and Specialty match

        // 1. Experience (20 pts)
        if (resume.experience === (job as any).experience) {
          score += 20;
        }

        // 2. Expected Salary (20 pts)
        if (resume.expectedSalary === (job as any).salary) {
          score += 20;
        }

        // 3. Language (20 pts)
        const jobLanguages = Array.isArray(job.languages)
          ? job.languages.map((l: any) => (typeof l === 'string' ? l.split(':')[0] : l.name).toLowerCase())
          : [];
        const hasMatchingLanguage = jobLanguages.some(jl => resumeLanguages.includes(jl));
        if (hasMatchingLanguage || jobLanguages.length === 0) {
          score += 20;
        }

        matchesToCreate.push({
          userId: resume.userId,
          jobId: job.id,
          companyId: job.companyId,
          score: Math.round(score),
          status: 'PENDING'
        });
      }

      if (matchesToCreate.length > 0) {
        await prisma.match.createMany({
          data: matchesToCreate,
          skipDuplicates: true
        });
      }
    } catch (matchErr) {
      console.error('Reverse matching error (non-fatal):', matchErr);
    }

    return NextResponse.json(resume, { status: 201 });
  } catch (err: any) {
    console.error('Resume upsert error:', err);
    console.error('Error stack:', err.stack);
    console.error('Error code:', err.code);
    console.error('Error meta:', err.meta);

    const logPath = path.join(process.cwd(), 'debug_log.txt');
    const logData = `[${new Date().toISOString()}] Error: ${err.message}\nStack: ${err.stack}\nBody: ${JSON.stringify(body, null, 2)}\n\n`;
    fs.appendFileSync(logPath, logData);

    let errorMessage = 'حدث خطأ أثناء حفظ السيرة الذاتية';
    if (err.code === 'P2002') {
      errorMessage = 'هذا المستخدم لديه سجل سيرة ذاتية موجود بالفعل';
    } else if (err.message?.includes('Unknown argument')) {
      errorMessage = 'فشل الحفظ: يرجى التأكد من مزامنة قاعدة البيانات (Prisma Generate)';
    }

    return NextResponse.json({
      error: errorMessage,
      message: errorMessage, // for backward compatibility with frontend catch
      details: err.message,
      code: err.code
    }, { status: 500 });
  }
}
