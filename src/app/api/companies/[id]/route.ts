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

        const company = await prisma.company.findUnique({
            where: { id: params.id },
            include: {
                posts: {
                    orderBy: { createdAt: "desc" },
                },
                jobs: {
                    where: {
                        deadline: {
                            gt: new Date()
                        }
                    }
                }
            },
        });

        if (!company) {
            return NextResponse.json({ error: "الشركة غير موجودة" }, { status: 404 });
        }

        // Omit sensitive info if needed (like password)
        const { password: _, ...safeCompany } = company as any;

        return NextResponse.json(safeCompany);
    } catch (error) {
        console.error("Error fetching company profile:", error);
        return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
    }
}
