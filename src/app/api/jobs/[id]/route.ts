import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions) as any

        const job = await prisma.job.findUnique({
            where: { id: params.id },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        industry: true,
                        location: true
                    }
                },
                matches: session?.user?.id ? {
                    where: {
                        userId: session.user.id
                    }
                } : false
            }
        })

        if (!job) {
            return NextResponse.json({ error: 'الوظيفة غير موجودة' }, { status: 404 })
        }

        const jobData = job as any;

        // Transform to frontend expectation
        const transformedJob = {
            id: jobData.id,
            title: jobData.title,
            company: jobData.company.name,
            companyId: jobData.company.id,
            companyImage: jobData.company.image,
            location: jobData.location || 'غير محدد',
            salary: jobData.salary || 'غير محدد',
            type: jobData.type || 'دوام كامل',
            description: jobData.description,
            requirements: jobData.requirements || [],
            matchScore: 0, // Placeholder
            status: jobData.matches && jobData.matches.length > 0 ? jobData.matches[0].status.toLowerCase() : null,
            createdAt: jobData.createdAt
        }

        return NextResponse.json(transformedJob)
    } catch (error) {
        console.error('Error fetching job details:', error)
        return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
    }
}
