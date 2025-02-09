/*
  Warnings:

  - You are about to drop the column `is_private` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_private",
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;
