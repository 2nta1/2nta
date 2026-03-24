import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (!session?.user?.id) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const candidate = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                resume: true,
            },
        });

        if (!candidate) {
            return NextResponse.json({ error: "المرشح غير موجود" }, { status: 404 });
        }

        return NextResponse.json(candidate);
    } catch (error) {
        console.error("Error fetching candidate profile:", error);
        return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
    }
}
