import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: { chatId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'غير مصرح' },
                { status: 401 }
            )
        }

        const { chatId } = params

        // Fetch the chat with all messages and related data
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        }
                    }
                }
            }
        })

        if (!chat) {
            return NextResponse.json(
                { error: 'المحادثة غير موجودة' },
                { status: 404 }
            )
        }

        // Verify user has access to this chat
        if (chat.userId !== session.user.id && chat.companyId !== session.user.id) {
            return NextResponse.json(
                { error: 'غير مصرح' },
                { status: 403 }
            )
        }

        return NextResponse.json(chat)
    } catch (error) {
        console.error('Error fetching chat:', error)
        return NextResponse.json(
            { error: 'حدث خطأ أثناء جلب المحادثة' },
            { status: 500 }
        )
    }
}
