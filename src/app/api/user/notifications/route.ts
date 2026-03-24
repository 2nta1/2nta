import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions) as any;
  if (!session?.user?.id) {
    console.log('GET Notifications: Unauthenticated');
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  console.log('GET Notifications: Fetching for UserId:', session.user.id);
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  console.log('GET Notifications: Found count:', notifications.length);

  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "معرف مفقود" }, { status: 400 });
  }

  await prisma.notification.update({
    where: { id },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
