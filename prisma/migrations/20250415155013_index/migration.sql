/*
  Warnings:

  - You are about to drop the column `completed` on the `CaseProgress` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `CaseProgress` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `CourseProgress` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `CourseProgress` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CaseProgress_courseId_completed_idx";

-- AlterTable
ALTER TABLE "CaseProgress" DROP COLUMN "completed",
DROP COLUMN "completedAt";

-- AlterTable
ALTER TABLE "CourseProgress" DROP COLUMN "completed",
DROP COLUMN "completedAt";

-- CreateIndex
CREATE INDEX "CaseProgress_courseId_idx" ON "CaseProgress"("courseId");

-- CreateIndex
CREATE INDEX "Favorite_profileId_type_targetId_idx" ON "Favorite"("profileId", "type", "targetId");
