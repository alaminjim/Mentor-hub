/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `TutorProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "email" TEXT DEFAULT 'tutor@gmail.com',
ADD COLUMN     "phone" TEXT DEFAULT '0124738423848';

-- CreateIndex
CREATE UNIQUE INDEX "TutorProfile_email_key" ON "TutorProfile"("email");
