import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    const company = await prisma.company.findUnique({ where: { email: session.user.email } });
    if (!company) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    const companyId = company.id;

    const posts = await prisma.post.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        type: true,
        image: true,

        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('GET /company/posts error', error);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'COMPANY') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { content, type = 'GENERAL', image } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'المحتوى مطلوب' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        content,
        type,
        image,
        companyId: (session.user as any).id,
      },
      select: {
        id: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('POST /company/posts error', error);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
