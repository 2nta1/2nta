-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('HIGH_SCHOOL', 'DIPLOMA', 'BACHELOR', 'MASTER', 'PHD');

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_jobId_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "educationLevel" "EducationLevel",
ADD COLUMN     "graduationYear" INTEGER;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "graduationYear" INTEGER;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
