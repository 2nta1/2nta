import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

const ALLOWED_FIELDS = [
  'image',
  'birthDate',
  'phone',
  'whatsapp',
  'linkedin',
  'facebook',
] as const;

export type SettingsBody = Partial<Record<(typeof ALLOWED_FIELDS)[number], any>>;

async function getUserId() {
  // @ts-ignore
  const session = await getServerSession(authOptions as any);
  if (!session) return undefined;
  const userId = (session.user as any)?.id;
  if (userId) return userId as string;
  const dbUser = await prisma.user.findUnique({ where: { email: session.user?.email ?? '' }, select: { id: true } });
  return dbUser?.id;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'unauth' }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: userId }, select: {
      image: true, birthDate: true, phone: true, whatsapp: true, linkedin: true, facebook: true,
    }
  });
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'unauth' }, { status: 401 });

  const body: SettingsBody = await req.json();
  const data: any = {};
  for (const f of ALLOWED_FIELDS) {
    if (f in body) data[f] = body[f as keyof SettingsBody];
  }
  try {
    const user = await prisma.user.update({ where: { id: userId }, data });
    return NextResponse.json(user);
  } catch (err: any) {
    console.error('settings update error:', err);
    let message = 'حدث خطأ أثناء تحديث البيانات';
    if (err.code === 'P2002') message = 'البيانات المدخلة موجودة مسبقاً';
    if (err.message?.includes('Unknown argument')) {
      message = 'فشل التحديث: يرجى التأكد من مزامنة قاعدة البيانات (Prisma Generate)';
    }
    return NextResponse.json({
      error: message,
      details: err.message,
      code: err.code
    }, { status: 500 });
  }
}
