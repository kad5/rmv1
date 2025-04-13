/*
  Warnings:

  - The values [AUTOBILLING] on the enum `PreferenceKey` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `lessonId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `progressId` on the `CaseProgress` table. All the data in the column will be lost.
  - You are about to drop the column `progressId` on the `ExamAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `cardId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `examId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Preference` table. All the data in the column will be lost.
  - You are about to drop the column `examId` on the `QuestionAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `progressId` on the `QuestionAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LessonProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[profileId,courseId,caseId]` on the table `CaseProgress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId,type,targetId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId,key,productId]` on the table `Preference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[appleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[twitterId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `CaseProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `ExamAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Favorite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `profileId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Preference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examAttemptId` to the `QuestionAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `QuestionAttempt` table without a default value. This is not possible if the table is not empty.
  - Made the column `subscriptionEnd` on table `Subscription` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `profileId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "FeedbackTargetType" AS ENUM ('COURSE_CONTENT', 'EXAM');

-- CreateEnum
CREATE TYPE "FavoriteTargetType" AS ENUM ('CARD', 'CASE', 'QUESTION');

-- CreateEnum
CREATE TYPE "CourseContnetType" AS ENUM ('LESSON', 'QUIZ');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CardType" ADD VALUE 'emergency';
ALTER TYPE "CardType" ADD VALUE 'dd';
ALTER TYPE "CardType" ADD VALUE 'aunt_minnie';

-- AlterEnum
BEGIN;
CREATE TYPE "PreferenceKey_new" AS ENUM ('DARK_MODE', 'SIDEBAR_POSITION', 'EMAIL_MARKETING', 'EMAIL_NOTIFICATION', 'MODE_2B_COURSE');
ALTER TABLE "Preference" ALTER COLUMN "key" TYPE "PreferenceKey_new" USING ("key"::text::"PreferenceKey_new");
ALTER TYPE "PreferenceKey" RENAME TO "PreferenceKey_old";
ALTER TYPE "PreferenceKey_new" RENAME TO "PreferenceKey";
DROP TYPE "PreferenceKey_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "CaseProgress" DROP CONSTRAINT "CaseProgress_progressId_fkey";

-- DropForeignKey
ALTER TABLE "ExamAttempt" DROP CONSTRAINT "ExamAttempt_progressId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_progressId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_userId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_progressId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_lessonId_fkey";

-- DropIndex
DROP INDEX "Card_lessonId_idx";

-- DropIndex
DROP INDEX "CaseProgress_progressId_courseId_caseId_key";

-- DropIndex
DROP INDEX "ExamAttempt_progressId_examBankId_examId_attemptedAt_idx";

-- DropIndex
DROP INDEX "Favorite_userId_type_idx";

-- DropIndex
DROP INDEX "QuestionAttempt_progressId_examId_questionId_idx";

-- DropIndex
DROP INDEX "RefreshToken_token_key";

-- DropIndex
DROP INDEX "User_provider_providerId_key";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "lessonId",
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CaseProgress" DROP COLUMN "progressId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExamAttempt" DROP COLUMN "progressId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "FavoriteTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "cardId",
DROP COLUMN "examId",
DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL,
ADD COLUMN     "targetId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuestionAttempt" DROP COLUMN "examId",
DROP COLUMN "progressId",
ADD COLUMN     "answer" TEXT,
ADD COLUMN     "examAttemptId" TEXT NOT NULL,
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "subscriptionEnd" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider",
DROP COLUMN "providerId",
ADD COLUMN     "activatedAccount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "appleId" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD COLUMN     "twitterId" TEXT,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "Lesson";

-- DropTable
DROP TABLE "LessonProgress";

-- DropTable
DROP TABLE "Progress";

-- DropTable
DROP TABLE "Quiz";

-- DropEnum
DROP TYPE "AuthProvider";

-- DropEnum
DROP TYPE "FavoriteType";

-- DropEnum
DROP TYPE "QuizOrLesson";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "currentLevel" TEXT,
    "nextExam" TIMESTAMP(3),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivateToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivateToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "evaluation" INTEGER NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" "FeedbackTargetType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseContnet" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "type" "CourseContnetType" NOT NULL,
    "module" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "orderString" TEXT NOT NULL,
    "metadata" JSONB,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tips" JSONB,
    "additionalResources" JSONB,
    "quizId" TEXT,

    CONSTRAINT "CourseContnet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseProgress" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "courseContnetId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivateToken_token_key" ON "ActivateToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_profileId_targetId_targetType_key" ON "Feedback"("profileId", "targetId", "targetType");

-- CreateIndex
CREATE UNIQUE INDEX "CourseContnet_quizId_key" ON "CourseContnet"("quizId");

-- CreateIndex
CREATE INDEX "CourseContnet_courseId_idx" ON "CourseContnet"("courseId");

-- CreateIndex
CREATE INDEX "CourseContnet_type_idx" ON "CourseContnet"("type");

-- CreateIndex
CREATE INDEX "CourseProgress_profileId_courseId_idx" ON "CourseProgress"("profileId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgress_profileId_courseId_courseContnetId_key" ON "CourseProgress"("profileId", "courseId", "courseContnetId");

-- CreateIndex
CREATE INDEX "Card_parentId_idx" ON "Card"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseProgress_profileId_courseId_caseId_key" ON "CaseProgress"("profileId", "courseId", "caseId");

-- CreateIndex
CREATE INDEX "ExamAttempt_profileId_examBankId_idx" ON "ExamAttempt"("profileId", "examBankId");

-- CreateIndex
CREATE INDEX "ExamAttempt_profileId_examBankId_examId_idx" ON "ExamAttempt"("profileId", "examBankId", "examId");

-- CreateIndex
CREATE INDEX "Favorite_profileId_providerId_idx" ON "Favorite"("profileId", "providerId");

-- CreateIndex
CREATE INDEX "Favorite_profileId_providerId_type_idx" ON "Favorite"("profileId", "providerId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_profileId_type_targetId_key" ON "Favorite"("profileId", "type", "targetId");

-- CreateIndex
CREATE INDEX "Note_profileId_providerId_idx" ON "Note"("profileId", "providerId");

-- CreateIndex
CREATE INDEX "Preference_profileId_idx" ON "Preference"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_profileId_key_productId_key" ON "Preference"("profileId", "key", "productId");

-- CreateIndex
CREATE INDEX "QuestionAttempt_profileId_examAttemptId_questionId_idx" ON "QuestionAttempt"("profileId", "examAttemptId", "questionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_appleId_key" ON "User"("appleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitterId_key" ON "User"("twitterId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivateToken" ADD CONSTRAINT "ActivateToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseContnet" ADD CONSTRAINT "CourseContnet_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "CourseContnet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseContnet" ADD CONSTRAINT "CourseContnet_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CourseContnet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseProgress" ADD CONSTRAINT "CaseProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_examAttemptId_fkey" FOREIGN KEY ("examAttemptId") REFERENCES "ExamAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
