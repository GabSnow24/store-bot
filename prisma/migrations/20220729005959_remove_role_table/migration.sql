/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Roles" NOT NULL;

-- DropTable
DROP TABLE "Role";
