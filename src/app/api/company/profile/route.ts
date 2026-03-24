import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { AuthOptions, DefaultSession } from 'next-auth';
import type { Session } from 'next-auth';

// Define custom types
type CompanySize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';

type CompanyData = {
  name: string;
  description: string | null;
  website: string | null;
  companySize: CompanySize;
  industry: string;
  foundedYear: number | null;
  clients: string | null;
  products: string | null;
  image: string | null;
  phone: string;
  contactPerson: string;
  commercialNumber: string;
};

// Extend NextAuth session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

// Create a type-safe session getter with proper error handling
async function getAuthSession() {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }
    return session as Session & { user: { email: string } };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication failed');
  }
}

// Define the company profile response type
type CompanyProfileResponse = {
  name: string;
  description: string | null;
  website: string | null;
  websiteUrl: string | null; // Add websiteUrl for mapped response
  companySize: CompanySize | null;
  industry: string;
  foundedYear: number | null;
  clients: string | null;
  contactPerson: string | null;
  commercialNumber: string | null;
  products: string | null;
  image: string | null;
  phone: string;
  specialty: string | null;
  country: string | null;
  province: string | null;
  region: string | null;
};

// Define the update request type
type UpdateCompanyProfileRequest = Partial<Omit<CompanyProfileResponse, 'contactPerson' | 'commercialNumber'>> & {
  name: string; // Make name required for updates
};

// Extend the NextAuth session type
declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

// Type guard to check if the session has a user with email
function hasUserWithEmail(session: any): session is { user: { email: string } } {
  return !!session?.user?.email;
}

// GET company profile
export async function GET() {
  try {
    let session;
    try {
      session = await getAuthSession();
    } catch (error) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // Fetch company data via Prisma ORM
    const company = await prisma.company.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        description: true,
        website: true, // DB website field (Company Website)
        googleMapsLink: true, // DB googleMapsLink field
        companySize: true,
        industry: true,
        foundedYear: true,
        clients: true,
        products: true,
        image: true,
        phone: true,
        contactPerson: true,
        commercialNumber: true,
        specialty: true,
        country: true,
        province: true,
        region: true,
        city: true,
        address: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'الشركة غير موجودة' },
        { status: 404 }
      );
    }

    // Transform response to match frontend expectations
    const response: CompanyProfileResponse = {
      ...company,
      companySize: company.companySize as CompanySize | null,
      website: company.googleMapsLink, // Map DB googleMapsLink -> Frontend website field
      websiteUrl: company.website,     // Map DB website -> Frontend websiteUrl field
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات الشركة' },
      { status: 500 }
    );
  }
}

// PATCH update company profile
export async function PATCH(req: Request) {
  try {
    let session;
    try {
      session = await getAuthSession();
    } catch (error) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const data: UpdateCompanyProfileRequest = await req.json();

    // Validate required fields
    if (!data.name?.trim()) {
      return NextResponse.json(
        { error: 'اسم الشركة مطلوب' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      name: data.name.trim(),
      ...(data.description !== undefined && { description: data.description?.trim() || null }),
      ...(data.websiteUrl !== undefined && { website: data.websiteUrl?.trim() || null }), // Frontend websiteUrl -> Backend website
      ...(data.website !== undefined && { googleMapsLink: data.website?.trim() || null }), // Frontend website -> Backend googleMapsLink
      ...(data.companySize !== undefined && { companySize: data.companySize }),
      ...(data.industry !== undefined && { industry: data.industry.trim() }),
      ...(data.specialty !== undefined && { specialty: data.specialty?.trim() || null }),
      ...(data.foundedYear !== undefined && { foundedYear: data.foundedYear ? parseInt(data.foundedYear.toString()) : null }),
      ...(data.clients !== undefined && { clients: data.clients?.trim() || null }),
      ...(data.products !== undefined && { products: data.products?.trim() || null }),
      ...(data.image !== undefined && { image: data.image?.trim() || null }),
      ...(data.phone !== undefined && { phone: data.phone.trim() }),
      ...(data.commercialNumber !== undefined && { commercialNumber: data.commercialNumber?.trim() || null }),
      ...(data.contactPerson !== undefined && { contactPerson: data.contactPerson?.trim() || null }),
      ...(data.country !== undefined && { country: data.country?.trim() || null }),
      ...(data.province !== undefined && { province: data.province?.trim() || null }),
      ...(data.region !== undefined && { region: data.region?.trim() || null }),
    };

    // Validating and handling the password for the new company record if it needs to be created
    // Since the auth mainly checks the User table, we can use a placeholder or sync with User password if desired.
    // For now, let's fetch the user to get a password hash to keep it consistent, or fallback to a placeholder.
    const userRecord = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { password: true }
    });

    // Fallback password (hashed 'password') just in case, though user should exist if logged in.
    const companyPassword = userRecord?.password || '$2a$10$XXXXXXXXXXXXXXXXXXXXXX';

    // Use Prisma's upsert to create if not exists, or update if exists
    const updatedCompany = await prisma.company.upsert({
      where: { email: session.user.email as string },
      update: updateData,
      create: {
        email: session.user.email,
        password: companyPassword,
        role: 'COMPANY',
        ...updateData,
      }
    });

    // We can return the updatedCompany directly since upsert returns the object
    /* 
    // Fetch the updated company data via Prisma (Redundant if upsert returns what we need, 
    // but upsert return includes everything. The original code selected specific fields.
    // Let's keep the select to be safe and consistent with response type or just map it.)
    */

    // Let's re-fetch to ensure we match the exact response shape or just map the result of upsert.
    // Upsert returns the full object. We can just use that, but to match the previous response strictness (excluding password etc implicitly by not selecting it? No, upsert returns all).
    // Let's just return the necessary fields to the client.

    const responsePayload = {
      name: updatedCompany.name,
      description: updatedCompany.description,
      website: updatedCompany.website,
      companySize: updatedCompany.companySize,
      industry: updatedCompany.industry,
      foundedYear: updatedCompany.foundedYear,
      clients: updatedCompany.clients,
      products: updatedCompany.products,
      image: updatedCompany.image,
      phone: updatedCompany.phone,
      contactPerson: updatedCompany.contactPerson,
      commercialNumber: updatedCompany.commercialNumber,
    };

    return NextResponse.json({
      message: 'تم تحديث الملف بنجاح',
      company: responsePayload,
    });
  } catch (error: any) {
    console.error('Error updating company profile:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'لم يتم العثور على ملف الشركة' },
        { status: 404 }
      );
    }

    // Return the actual error message for debugging
    return NextResponse.json(
      { error: `فشل الحفظ: ${error.message || 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}
