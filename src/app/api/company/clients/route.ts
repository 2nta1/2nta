import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const company = await prisma.company.findUnique({
            where: { email: session.user.email },
        });

        if (!company) {
            return new NextResponse('Company not found', { status: 404 });
        }

        const clients = await prisma.client.findMany({
            where: { companyId: company.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(clients);
    } catch (error) {
        console.error('[CLIENTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, email, phone } = body;

        const company = await prisma.company.findUnique({
            where: { email: session.user.email },
        });

        if (!company) {
            return new NextResponse('Company not found', { status: 404 });
        }

        const client = await prisma.client.create({
            data: {
                name,
                email,
                phone,
                companyId: company.id,
            },
        });

        return NextResponse.json(client);
    } catch (error) {
        console.error('[CLIENTS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
