import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const type = req.nextUrl.searchParams.get('type');
        const parent = req.nextUrl.searchParams.get('parent');

        const where: any = {};
        if (type) where.type = type;
        if (parent) where.parent = parent;

        // Fetch discovered constants that either have multiple entries OR are approved
        // In a production app, we would only show approved ones, but for this demo, 
        // we show everything to demonstrate the learning immediately.
        const constants = await prisma.discoveredConstant.findMany({
            where,
            orderBy: {
                count: 'desc'
            },
            take: 200
        });

        return NextResponse.json(constants);
    } catch (error: any) {
        console.error('Error fetching discovered constants:', error);
        return NextResponse.json({ error: 'Failed to fetch constants' }, { status: 500 });
    }
}
