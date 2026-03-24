import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const company = await prisma.company.findUnique({
      where: { email: session.user.email },
      include: {
        jobs: {
          include: {
            matches: {
              include: {
                chat: true,
                user: {
                  include: {
                    resume: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!company) {
      return NextResponse.json({ error: "شركة غير موجودة" }, { status: 404 });
    }

    // Process matches for each job
    const matches = company.jobs.flatMap(job => {
      return job.matches.map(match => ({
        jobId: job.id,
        jobTitle: job.title,
        candidateId: match.userId,
        candidateName: match.user.name,
        resume: match.user.resume,
        score: match.score,
        status: match.status,
        chatId: match.chat?.id,
        createdAt: match.createdAt,
        updatedAt: match.updatedAt
      }));
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    const company = session?.user;

    if (!company?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { jobId, userId, status } = await request.json();
    console.log('--- Match Update Attempt ---');
    console.log('JobId:', jobId, 'Target UserId:', userId, 'Status:', status);
    console.log('Company (Session User):', company.email, 'ID:', company.id);
    const job = await prisma.job.findUnique({
      where: { id: jobId, companyId: company.id },
      include: { company: true }
    });

    if (!job) {
      return NextResponse.json({ error: "وظيفة غير موجودة" }, { status: 404 });
    }

    // Get the existing match
    const existingMatch = await prisma.match.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId
        }
      }
    });

    // Update or create the match
    const match = await prisma.match.upsert({
      where: {
        userId_jobId: {
          userId,
          jobId
        }
      },
      update: { status },
      create: {
        jobId,
        userId,
        companyId: company.id,
        status,
        score: existingMatch?.score || 0
      }
    });

    // If accepted, create a notification and chat
    if (status === 'ACCEPTED') {
      try {
        // Find or create a user record for the company to act as a sender
        let companyUser = await prisma.user.findFirst({
          where: { email: company.email }
        });

        if (!companyUser) {
          console.log('Creating shadow user for company:', company.email);
          try {
            companyUser = await prisma.user.create({
              data: {
                id: company.id, // Try to use company ID
                email: company.email,
                name: company.name || 'Company',
                password: 'SHADOW_USER_' + Math.random().toString(36),
                role: 'COMPANY'
              }
            });
          } catch (createErr) {
            // If ID already exists or other error, try finding by email again or create with auto ID
            companyUser = await prisma.user.findUnique({ where: { email: company.email } });
            if (!companyUser) {
              companyUser = await prisma.user.create({
                data: {
                  email: company.email,
                  name: company.name || 'Company',
                  password: 'SHADOW_USER_' + Math.random().toString(36),
                  role: 'COMPANY'
                }
              });
            }
          }
        }

        if (companyUser) {
          // Check if chat already exists for this match
          let chat = await prisma.chat.findUnique({
            where: { matchId: match.id }
          });

          if (!chat) {
            chat = await prisma.chat.create({
              data: {
                type: 'MATCH',
                matchId: match.id,
                userId: userId,           // Candidate ID (User Table)
                companyId: company.id,    // Company ID (Company Table)
                userChats: {
                  create: [
                    { userId: userId },             // Candidate (User Table)
                    { userId: companyUser.id }      // Company (User Table - Shadow)
                  ]
                },
                messages: {
                  create: {
                    senderId: companyUser.id,
                    content: `مرحباً، لقد تم قبولك لوظيفة "${job.title}" في شركتنا. نتمنى لك كل التوفيق!`
                  }
                }
              }
            });
          }

          // Create notification
          console.log('Creating notification for User:', userId);
          const companyName = job.company?.name || company.name || 'الشركة';
          const notification = await prisma.notification.create({
            data: {
              userId,
              companyId: company.id,
              type: 'MATCH_ACCEPTED',
              data: {
                jobId,
                jobTitle: job.title,
                companyName: companyName,
                chatId: chat.id // UI expects chatId inside data blob
              },
              title: 'تم قبولك لوظيفة',
              message: `تم قبولك لوظيفة "${job.title}" في شركة "${companyName}"`,
              chatId: chat.id
            }
          });
          console.log('Notification created ID:', notification.id);
        }
      } catch (err) {
        console.error('Chat/Notification error:', err);
      }
    }

    return NextResponse.json({
      match,
      chatId: (match as any).chat?.id // Include chatId if it matches relations or wait for return
    });
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
