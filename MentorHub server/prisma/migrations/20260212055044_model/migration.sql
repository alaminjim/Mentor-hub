-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_tutorId_fkey";

-- DropIndex
DROP INDEX "TutorProfile_email_key";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TutorProfile" ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "email" DROP DEFAULT,
ALTER COLUMN "phone" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "TutorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
