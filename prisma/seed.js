// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('بدء إنشاء البيانات الأولية...')
  
  // إنشاء الوسوم
  const tags = [
    { name: 'تطوير الويب', category: 'مهارة' },
    { name: 'تطوير تطبيقات الجوال', category: 'مهارة' },
    { name: 'تصميم جرافيك', category: 'مهارة' },
    { name: 'مبتدئ', category: 'مستوى' },
    { name: 'متوسط', category: 'مستوى' },
    { name: 'محترف', category: 'مستوى' },
  ]

  console.log('جاري إنشاء الوسوم...')
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    })
    console.log(`تم إنشاء الوسم: ${tag.name}`)
  }

  // إنشاء مستخدم تجريبي
  console.log('جاري إنشاء مستخدم تجريبي...')
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'مستخدم تجريبي',
      email: 'test@example.com',
      password: hashedPassword,
      tags: {
        create: [
          { tag: { connect: { id: 1 } } },
          { tag: { connect: { id: 4 } } },
        ]
      }
    },
  })

  console.log('✅ تم إنشاء البيانات الأولية بنجاح')
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إنشاء البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })