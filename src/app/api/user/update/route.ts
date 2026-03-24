import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'غير مصرح' }), { status: 401 })
    }

    const { name, phone, skills, experience, education } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        skills,
        experience,
        education,
      },
    })

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      skills: updatedUser.skills,
      experience: updatedUser.experience,
      education: updatedUser.education,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return new NextResponse(
      JSON.stringify({ error: 'حدث خطأ أثناء تحديث الملف الشخصي' }),
      { status: 500 }
    )
  }
}