import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.match.deleteMany()
    await prisma.job.deleteMany()
    await prisma.company.deleteMany()
    await prisma.user.deleteMany()
  } catch (error) {
    console.log('Error cleaning up tables:', error)
  }

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create sample company
  const company = await prisma.company.create({
    data: {
      name: 'شركة التقنية المتطورة',
      email: 'company@tech.com',
      password: hashedPassword,
      description: 'شركة رائدة في مجال التقنية والبرمجيات',
      role: Role.COMPANY,
      specialty: 'Software Development',
      city: 'Riyadh',
      country: 'Saudi Arabia'
    }
  })

  // Create user
  const user = await prisma.user.create({
    data: {
      name: 'User One',
      email: 'user@test.com',
      password: hashedPassword,
      role: Role.USER
    }
  })

  // Create sample job
  await prisma.job.create({
    data: {
      title: 'مطور ويب',
      description: 'مطلوب مطور ويب خبرة في React و Node.js',
      companyId: company.id
    }
  })

  console.log('✅ Seeding completed successfully!')
  console.log('Company Email: company@tech.com')
  console.log('User Email: user@test.com')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })