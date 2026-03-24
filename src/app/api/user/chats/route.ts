import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const chats = await prisma.chat.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        { companyId: session.user.id },
      ],
    },
    include: {
      company: true,
      user: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  // Add unread count
  const chatsWithUnread = await Promise.all(
    chats.map(async (chat) => {
      const unread = await prisma.userChat.count({
        where: {
          userId: session.user.id,
          chatId: chat.id,
          unread: { gt: 0 },
        },
      })
      return { ...chat, unread }
    })
  )

  return NextResponse.json(chatsWithUnread)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const { companyId } = await request.json()
  if (!companyId) {
    return NextResponse.json({ error: "معرف الشركة مطلوب" }, { status: 400 })
  }

  const chat = await prisma.chat.upsert({
    where: {
      userId_companyId: {
        userId: session.user.id,
        companyId,
      },
    },
    create: {
      userId: session.user.id,
      companyId,
      user: { connect: { id: session.user.id } },
      company: { connect: { id: companyId } },
    },
    update: {},
  })

  return NextResponse.json(chat)
}
