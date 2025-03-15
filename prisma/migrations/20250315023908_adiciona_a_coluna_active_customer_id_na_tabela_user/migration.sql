-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activeCustomerId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_activeCustomerId_fkey" FOREIGN KEY ("activeCustomerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
