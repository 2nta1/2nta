const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncAllMatches() {
    console.log('--- Starting Global Match Sync ---');

    // Clear existing matches to avoid duplicates or outdated scores
    console.log('Clearing existing matches...');
    await prisma.match.deleteMany({});

    const jobs = await prisma.job.findMany();
    const resumes = await prisma.resume.findMany();

    console.log(`Processing ${jobs.length} jobs and ${resumes.length} resumes...`);

    const matchesToCreate = [];

    for (const job of jobs) {
        // Normalize job languages
        const jobLanguages = Array.isArray(job.languages)
            ? job.languages.map(l => l.split(':')[0].toLowerCase())
            : [];

        for (const res of resumes) {
            if (job.category === res.category && job.specialty === res.specialty) {
                // Core Match Base 40%
                let score = 40;

                // 1. Experience (20 pts)
                if (res.experience === job.experience) {
                    score += 20;
                }

                // 2. Salary (20 pts)
                if (res.expectedSalary === job.salary) {
                    score += 20;
                }

                // 3. Language (20 pts)
                const resumeLanguages = (res.languages || []).map(l => l.split(':')[0].toLowerCase());
                const hasMatchingLanguage = jobLanguages.some(jl => resumeLanguages.includes(jl));
                if (hasMatchingLanguage || jobLanguages.length === 0) {
                    score += 20;
                }

                matchesToCreate.push({
                    userId: res.userId,
                    jobId: job.id,
                    companyId: job.companyId,
                    score: Math.round(score),
                    status: 'PENDING'
                });

                console.log(`Matched: User ${res.userId} with Job ${job.id} | Score: ${score}%`);
            }
        }
    }

    if (matchesToCreate.length > 0) {
        console.log(`Creating ${matchesToCreate.length} matches...`);
        await prisma.match.createMany({
            data: matchesToCreate,
            skipDuplicates: true
        });
        console.log('Sync completed successfully!');
    } else {
        console.log('No matches found to sync.');
    }
}

syncAllMatches()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
