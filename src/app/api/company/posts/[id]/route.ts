import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Get the company associated with the user
    const company = await prisma.company.findUnique({
      where: { email: session.user.email }
    });

    if (!company) {
      return NextResponse.json({ error: "شركة غير موجودة" }, { status: 404 });
    }

    // Delete the post
    const post = await prisma.post.delete({
      where: {
        id: params.id,
        companyId: company.id
      }
    });

    return NextResponse.json({ message: "تم حذف البوست بنجاح" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء حذف البوست" }, { status: 500 });
  }
}
