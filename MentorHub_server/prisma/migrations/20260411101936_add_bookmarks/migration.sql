-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "isDiscountApplied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tutorDiscountApproved" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
