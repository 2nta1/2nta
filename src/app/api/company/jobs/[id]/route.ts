import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const mapJobType = (t?: string) => {
  switch (t) {
    case 'PART_TIME':
    case 'دوام جزئي':
      return 'PART_TIME'
    case 'CONTRACT':
    case 'عقد':
      return 'CONTRACT'
    case 'INTERNSHIP':
    case 'تدريب':
      return 'INTERNSHIP'
    case 'FREELANCE':
    case 'عمل حر':
      return 'FREELANCE'
    default:
      return 'FULL_TIME'
  }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({ where: { id: params.id } })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    return NextResponse.json(job)
  } catch (e: any) {
    console.error('GET job error', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const company = await prisma.company.findUnique({ where: { email: session.user.email } })
    if (!company) return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 })

    const data = await req.json()
    const techNames: string[] = Array.isArray(data.techSkills)
      ? data.techSkills.map((s: any) => (typeof s === 'string' ? s : s.name))
      : []

    const updated = await prisma.job.update({
      where: { id: params.id, companyId: company.id },
      data: {
        title: data.specialty || data.category,
        description: data.description,
        location: data.country ? `${data.country}${data.province ? ' - ' + data.province : ''}` : undefined,
        salary: typeof data.salary === 'number' ? data.salary : undefined,
        type: data.jobType ? mapJobType(data.jobType) : undefined,
        requirements: techNames.length ? techNames : undefined,
        skills: techNames.length ? techNames : undefined,
        category: data.category ?? undefined,
        specialty: data.specialty ?? undefined,
        languages: Array.isArray(data.languages) ? data.languages.map((l: any) => typeof l === 'string' ? l : l.name) : undefined,
        softSkills: Array.isArray(data.softSkills) ? data.softSkills.map((s: any) => typeof s === 'string' ? s : s.name) : undefined,
        yearsExp: data.yearsExp ?? data.experience ?? undefined
      }
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('Update job error', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const company = await prisma.company.findUnique({ where: { email: session.user.email } })
    if (!company) return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 })

    await prisma.job.delete({ where: { id: params.id, companyId: company.id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Delete job error', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}