import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { MatchStatus } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'غير مصرح' }), { status: 401 })
    }

    const { jobId } = await request.json()

    if (!jobId) {
      return new NextResponse(JSON.stringify({ error: 'معرف الوظيفة مطلوب' }), { status: 400 })
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    })

    if (!job) {
      return new NextResponse(JSON.stringify({ error: 'الوظيفة غير موجودة' }), { status: 404 })
    }

    // Check if user already applied
    const existingMatch = await prisma.match.findFirst({
      where: {
        userId: session.user.id,
        jobId: jobId
      }
    })

    if (existingMatch) {
      return new NextResponse(
        JSON.stringify({ error: 'لقد تقدمت بالفعل لهذه الوظيفة' }),
        { status: 400 }
      )
    }

    // Create match/application
    const match = await prisma.match.create({
      data: {
        userId: session.user.id,
        jobId: jobId,
        companyId: job.companyId,
        status: MatchStatus.PENDING
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم التقديم على الوظيفة بنجاح',
      jobId,
      matchId: match.id,
      status: 'pending'
    })
  } catch (error) {
    console.error('Error applying to job:', error)
    return new NextResponse(
      JSON.stringify({ error: 'حدث خطأ أثناء التقديم على الوظيفة' }),
      { status: 500 }
    )
  }
}