/*
  Warnings:

  - You are about to drop the column `date` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `certifications` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `licenseExpiration` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `licenseNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `shiftPreferences` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `specializations` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `yearsOfExperience` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JobSkills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserSkills` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assignedDepartment` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignedSupervisor` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentsOnPerformance` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mealBreak` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendToRehire` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supervisorRating` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableWorkDays` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableWorkTiming` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citizenship` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequencyOfWork` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredFacilityType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `race` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Specialization" AS ENUM ('COMMUNITY_HEALTH', 'CRITICAL_CARE', 'GERONTOLOGY', 'EMERGENCY');

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "_JobSkills" DROP CONSTRAINT "_JobSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobSkills" DROP CONSTRAINT "_JobSkills_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserSkills" DROP CONSTRAINT "_UserSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSkills" DROP CONSTRAINT "_UserSkills_B_fkey";

-- DropIndex
DROP INDEX "Shift_userId_date_idx";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "assignedDepartment" TEXT NOT NULL,
ADD COLUMN     "assignedSupervisor" TEXT NOT NULL,
ADD COLUMN     "commentsOnPerformance" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "mealBreak" BOOLEAN NOT NULL,
ADD COLUMN     "recommendToRehire" BOOLEAN NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD COLUMN     "supervisorRating" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "bio",
DROP COLUMN "certifications",
DROP COLUMN "education",
DROP COLUMN "languages",
DROP COLUMN "licenseExpiration",
DROP COLUMN "licenseNumber",
DROP COLUMN "profilePictureUrl",
DROP COLUMN "shiftPreferences",
DROP COLUMN "specializations",
DROP COLUMN "yearsOfExperience",
ADD COLUMN     "availableWorkDays" TEXT NOT NULL,
ADD COLUMN     "availableWorkTiming" TEXT NOT NULL,
ADD COLUMN     "citizenship" TEXT NOT NULL,
ADD COLUMN     "frequencyOfWork" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "preferredFacilityType" TEXT NOT NULL,
ADD COLUMN     "race" TEXT NOT NULL,
ADD COLUMN     "specialization" "Specialization" NOT NULL;

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "Skill";

-- DropTable
DROP TABLE "_JobSkills";

-- DropTable
DROP TABLE "_UserSkills";

-- DropEnum
DROP TYPE "DocumentType";

-- CreateIndex
CREATE INDEX "Shift_userId_startDate_idx" ON "Shift"("userId", "startDate");
