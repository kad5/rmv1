/*
  Warnings:

  - The values [ACCOUT_DELETION] on the enum `verificationTokenType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `nextExam` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "verificationTokenType_new" AS ENUM ('ACCOUNT_CREATION', 'PASSWORD_RESET', 'ACCOUNT_DELETION', 'SERVICE_CANCELLATION');
ALTER TABLE "verificationToken" ALTER COLUMN "type" TYPE "verificationTokenType_new" USING ("type"::text::"verificationTokenType_new");
ALTER TYPE "verificationTokenType" RENAME TO "verificationTokenType_old";
ALTER TYPE "verificationTokenType_new" RENAME TO "verificationTokenType";
DROP TYPE "verificationTokenType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "nextExam",
ADD COLUMN     "nextExamDate" TIMESTAMP(3);
