import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: 'غير مصرح' }), { status: 401 })
  }

  return NextResponse.json(session.user)
}