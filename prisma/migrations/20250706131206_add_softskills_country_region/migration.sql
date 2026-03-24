/*
  Warnings:

  - Added the required column `country` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "softSkills" TEXT[],
ALTER COLUMN "expectedSalary" SET DATA TYPE TEXT;
