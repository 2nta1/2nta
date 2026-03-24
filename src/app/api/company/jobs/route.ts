import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'غير مصرح' }), { status: 401 })
    }

    // في هذا المخطط، حساب الشركة مخزن في جدول Company وليس مرتبطًا بعلاقة على User
    const company = await prisma.company.findUnique({
      where: { email: session.user.email }
    })

    if (!company) {
      return new NextResponse(
        JSON.stringify({ error: 'يجب أن تكون مسجلاً كشركة لنشر الوظائف' }),
        { status: 403 }
      )
    }

    const data = await request.json()

    // تجهيز قيم افتراضية للحفاظ على توافق المخطط
    const mapJobType = (t: string | undefined): 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' => {
      switch (t) {
        case 'دوام جزئي':
        case 'PART_TIME':
          return 'PART_TIME'
        case 'عقد':
        case 'CONTRACT':
          return 'CONTRACT'
        case 'تدريب':
        case 'INTERNSHIP':
          return 'INTERNSHIP'
        case 'عمل حر':
        case 'FREELANCE':
          return 'FREELANCE'
        default:
          return 'FULL_TIME'
      }
    }

    // استخراج أسماء المهارات التقنية فقط
    const techNames: string[] = Array.isArray(data.techSkills)
      ? data.techSkills.map((s: any) => (typeof s === 'string' ? s : s.name)).filter(Boolean)
      : [];

    const job = await prisma.job.create({
      data: {
        title: data.specialty || data.category || 'وظيفة',
        description: data.description || `${data.category || ''} - ${data.specialty || ''}`,
        category: data.category,
        specialty: data.specialty,
        location: data.country ? `${data.country}${data.province ? ' - ' + data.province : ''}` : 'غير محدد',
        salary: typeof data.salary === 'number' ? data.salary.toString() : (data.salary || null),
        type: mapJobType(data.jobType),
        workplace: data.workplace,
        requirements: techNames,
        skills: techNames,
        languages: Array.isArray(data.languages) ? data.languages.map((l: any) => typeof l === 'string' ? l : `${l.name}:${l.level}`) : [],
        softSkills: Array.isArray(data.softSkills) ? data.softSkills.map((s: any) => typeof s === 'string' ? s : `${s.name}:${s.level}`) : [],
        educationLevel: data.educationLevel,
        experience: data.yearsExp, // Added experience field
        graduationYear: data.graduationYear,
        startDate: data.startDate,
        deadline: data.deadline,
        benefits: Array.isArray(data.benefits) ? data.benefits : [],
        culture: data.culture,
        careerPath: data.careerPath,
        company: {
          connect: { id: company.id }
        }
      }
    })

    // create a feed post for the new job
    // ---- Matching algorithm ----
    try {
      const resumes = await prisma.resume.findMany({
        where: {
          category: data.category,
          specialty: data.specialty, // Mandatory match
        },
        include: {
          user: true,
        },
      });

      const matchesToCreate: any[] = [];
      const jobLanguages = Array.isArray(data.languages) ? data.languages.map((l: any) => (typeof l === 'string' ? l.split(':')[0] : l.name).toLowerCase()) : [];

      for (const res of resumes) {
        // Base score for Category and Specialty match is 40%
        let score = 40;

        // 1. Experience (20 pts)
        if (res.experience === data.yearsExp) {
          score += 20;
        }

        // 2. Salary (20 pts)
        if (res.expectedSalary === data.salary) {
          score += 20;
        }

        // 3. Language (20 pts)
        const resumeLanguages = (res.languages || []).map((l: string) => l.split(':')[0].toLowerCase());
        const hasMatchingLanguage = jobLanguages.some(jl => resumeLanguages.includes(jl));
        if (hasMatchingLanguage || jobLanguages.length === 0) {
          score += 20;
        }

        // Since Category/Specialty match is mandatory, we create matches for all found resumes
        matchesToCreate.push({
          userId: res.userId,
          jobId: job.id,
          companyId: company.id,
          score: Math.round(score),
        });
      }
      if (matchesToCreate.length) {
        await prisma.match.createMany({ data: matchesToCreate, skipDuplicates: true });
      }
    } catch (err) {
      console.error('matching error', err);
    }

    await prisma.post.create({
      data: {
        type: 'JOB',
        content: `${job.title} – ${job.location}`,
        companyId: company.id,
      },
    });

    return NextResponse.json(job)
  } catch (error: any) {
    console.error('Error creating job:', error)
    return new NextResponse(
      JSON.stringify({ error: error?.message || 'خطأ غير معروف', stack: error?.stack }),
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'غير مصرح' }), { status: 401 })
    }

    // في هذا المخطط، حساب الشركة مخزن في جدول Company وليس مرتبطًا بعلاقة على User
    const company = await prisma.company.findUnique({
      where: { email: session.user.email }
    })

    if (!company) {
      return new NextResponse(
        JSON.stringify({ error: 'يجب أن تكون مسجلاً كشركة لعرض الوظائف' }),
        { status: 403 }
      )
    }

    const jobs = await prisma.job.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { matches: true }
        }
      }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return new NextResponse(
      JSON.stringify({ error: 'حدث خطأ أثناء جلب الوظائف' }),
      { status: 500 }
    )
  }
}