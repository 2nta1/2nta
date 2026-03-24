import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Fetch all approved jobs with company information
    const jobs = await prisma.job.findMany({
      where: {
        isApproved: true
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        matches: session?.user?.id ? {
          where: {
            userId: session.user.id
          }
        } : false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to match frontend expectations
    const transformedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.name,
      companyId: job.company.id,
      location: job.location || 'غير محدد',
      salary: job.salary || 'غير محدد',
      type: job.type || 'دوام كامل',
      description: job.description,
      requirements: job.requirements || [],
      matchScore: 0, // TODO: Implement matching algorithm
      status: job.matches && job.matches.length > 0 ? job.matches[0].status.toLowerCase() : null
    }))

    return NextResponse.json(transformedJobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}