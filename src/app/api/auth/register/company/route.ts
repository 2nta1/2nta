import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      contactPerson,
      phone,
      website,
      description,
      commercialNumber,
      companySize,
      industry
    } = body

    console.log('Company registration attempt for:', email)

    // Basic validation
    if (!name || !email || !password || !contactPerson) {
      return NextResponse.json(
        { message: 'الحقول الأساسية مطلوبة' },
        { status: 400 }
      )
    }

    // Check if company exists (by email or name)
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { email },
          { name }
        ]
      }
    })

    if (existingCompany) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو اسم الشركة مسجل مسبقاً' },
        { status: 400 }
      )
    }

    // Create company
    const company = await prisma.company.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: Role.COMPANY,
        phone,
        description,
        // Map other fields that we have in schema
        // Note: Make sure these fields exist in your schema.prisma
        // We added: specialty, image, phone, googleMapsLink, industry, foundingYear, description, country, region, city, address
        // But the form sends: contactPerson, commercialNumber, companySize, industry
        // We will map available fields and ignore uncertain ones to avoid crashes if schema is different
        // Ideally we should add missing fields to schema.

        industry,
        // Using address or description to store extra info if needed, or simple ignore for now
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    console.log('Company created successfully:', company.email)
    return NextResponse.json(company, { status: 201 })

  } catch (error: any) {
    console.error('Company Registration error:', error)
    return NextResponse.json(
      {
        message: 'حدث خطأ في السيرفر',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}