import { prisma } from '@/lib/prisma'

// Minimum percentage to qualify as a match
const THRESHOLD = 0.75

export async function runMatchingForJob(jobId: string) {
  // Fetch job with required skills
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      jobSkills: true,
      company: true,
    },
  })
  if (!job) return
  const totalWeight = job.jobSkills.reduce((acc, js) => acc + js.weight, 0)
  if (totalWeight === 0) return

  // Fetch candidate users that have at least one of the required skills
  const candidates = await prisma.user.findMany({
    include: {
      userSkills: true,
    },
  })

  for (const user of candidates) {
    // Map skillId -> level for quick lookup
    const levelMap: Record<string, number> = {}
    user.userSkills.forEach((us) => {
      levelMap[us.skillId] = us.level
    })

    let numerator = 0
    for (const js of job.jobSkills) {
      const level = levelMap[js.skillId]
      if (level) {
        numerator += Math.min(level, js.weight)
      }
    }
    const score = numerator / totalWeight
    if (score >= THRESHOLD) {
      // Upsert match
      await prisma.match.upsert({
        where: {
          userId_jobId: {
            userId: user.id,
            jobId: job.id,
          },
        },
        update: { score },
        create: {
          userId: user.id,
          jobId: job.id,
          companyId: job.companyId,
          score,
        },
      })

      // Notification to user
      await prisma.notification.create({
        data: {
          userId: user.id,
          companyId: job.companyId,
          type: 'MATCH_CREATED',
          data: { jobId: job.id, score },
        },
      })
    }
  }
}

export async function runMatchingForUser(userId: string) {
  // Fetch user skills
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userSkills: true },
  })
  if (!user) return
  const levelMap: Record<string, number> = {}
  user.userSkills.forEach((us) => (levelMap[us.skillId] = us.level))

  // Fetch jobs with overlapping skills
  const jobs = await prisma.job.findMany({
    include: { jobSkills: true, company: true },
  })

  for (const job of jobs) {
    const totalWeight = job.jobSkills.reduce((acc, js) => acc + js.weight, 0)
    if (totalWeight === 0) continue
    let numerator = 0
    for (const js of job.jobSkills) {
      const level = levelMap[js.skillId]
      if (level) numerator += Math.min(level, js.weight)
    }
    const score = numerator / totalWeight
    if (score >= THRESHOLD) {
      await prisma.match.upsert({
        where: { userId_jobId: { userId: user.id, jobId: job.id } },
        update: { score },
        create: {
          userId: user.id,
          jobId: job.id,
          companyId: job.companyId,
          score,
        },
      })
      await prisma.notification.create({
        data: {
          userId: user.id,
          companyId: job.companyId,
          type: 'MATCH_CREATED',
          data: { jobId: job.id, score },
        },
      })
    }
  }
}
