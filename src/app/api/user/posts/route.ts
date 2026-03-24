import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'


import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  // @ts-ignore
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json([], { status: 401 })
  let userId = (session.user as any).id as string | undefined
  if (!userId) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user?.email ?? '' }, select: { id: true } })
    if (!dbUser) {
      // user not found
      return NextResponse.json({ error: 'user_not_found' }, { status: 404 })
    }
    userId = dbUser.id
  }
  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, image: true } } },
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  // @ts-ignore
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'unauth' }, { status: 401 })
  const { content, image } = await req.json()
  let userId = (session.user as any).id as string | undefined
  if (!userId) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user?.email ?? '' }, select: { id: true } })
    if (!dbUser) {
      // user not found
      return NextResponse.json({ error: 'user_not_found' }, { status: 404 })
    }
    userId = dbUser.id
  }
  if (!content && !image) {
    return NextResponse.json({ error: 'empty' }, { status: 400 })
  }

  let post
  try {
    post = await prisma.post.create({
    data: {
      content,
      image,
      type: 'GENERAL',
      user: { connect: { id: userId } },
    },
    include: { user: { select: { name: true, image: true } } },
  })
  } catch (err:any) {
    console.error('Create post error', err)
    return NextResponse.json({ error: 'db', message: err?.message }, { status: 500 })
  }
  return NextResponse.json(post, { status: 201 })
}
