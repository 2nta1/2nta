import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const messages = await prisma.message.findMany({
    where: {
      chat: {
        OR: [
          { userId: session.user.id },
          { companyId: session.user.id },
        ],
      },
    },
    include: {
      sender: true,
      chat: {
        include: {
          company: true,
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const { chatId, content } = await request.json()
  if (!chatId || !content) {
    return NextResponse.json({ error: "المحتوى ومعرف المحادثة مطلوبان" }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      chatId,
      senderId: session.user.id,
      content,
    },
    include: {
      sender: true,
      chat: {
        include: {
          company: true,
          user: true,
        },
      },
    },
  })

  // Update unread count for the other participant
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      user: true,
      company: true,
    },
  })

  if (chat) {
    const otherId = chat.userId === session.user.id ? chat.companyId : chat.userId
    await prisma.userChat.upsert({
      where: {
        userId_chatId: {
          userId: otherId,
          chatId,
        },
      },
      create: {
        userId: otherId,
        chatId,
        unread: 1,
      },
      update: {
        unread: {
          increment: 1,
        },
      },
    })
  }

  return NextResponse.json(message)
}
