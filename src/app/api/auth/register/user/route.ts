import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    console.log('User registration attempt for:', email)

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني مسجل مسبقاً' },
        { status: 400 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: Role.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    console.log('User created successfully:', user.email)
    return NextResponse.json(user, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        message: 'حدث خطأ في السيرفر',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}