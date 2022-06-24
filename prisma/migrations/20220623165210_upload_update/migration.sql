/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Upload` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "size" DROP NOT NULL;
