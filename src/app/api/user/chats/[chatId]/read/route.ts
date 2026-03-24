import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const { chatId } = await request.json()
  if (!chatId) {
    return NextResponse.json({ error: "معرف المحادثة مطلوب" }, { status: 400 })
  }

  await prisma.userChat.updateMany({
    where: {
      userId: session.user.id,
      chatId,
    },
    data: {
      unread: 0,
      lastRead: new Date(),
    },
  })

  return NextResponse.json({ success: true })
}
