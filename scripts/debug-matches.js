const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMatches() {
    console.log('--- Checking Jobs ---');
    const jobs = await prisma.job.findMany({
        select: { id: true, title: true, category: true, specialty: true }
    });
    jobs.forEach(j => {
        console.log(`Job ID: ${j.id} | Title: ${j.title} | Category: "${j.category}" | Specialty: "${j.specialty}"`);
    });

    console.log('\n--- Checking Resumes ---');
    const resumes = await prisma.resume.findMany({
        select: { userId: true, category: true, specialty: true }
    });
    resumes.forEach(r => {
        console.log(`User ID: ${r.userId} | Category: "${r.category}" | Specialty: "${r.specialty}"`);
    });

    console.log('\n--- Potential Matches (Exact String Match) ---');
    for (const job of jobs) {
        for (const res of resumes) {
            if (job.category === res.category && job.specialty === res.specialty) {
                console.log(`POTENTIAL MATCH: Job ${job.id} <-> User ${res.userId}`);
            }
        }
    }

    console.log('\n--- Existing Matches in Database ---');
    const matches = await prisma.match.findMany();
    console.log(`Total Matches: ${matches.length}`);
    matches.forEach(m => {
        console.log(`Match: Job ${m.jobId} <-> User ${m.userId} | Score: ${m.score}`);
    });
}

checkMatches()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
