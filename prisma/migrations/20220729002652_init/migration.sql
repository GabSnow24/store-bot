-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('INFO', 'WARN', 'ERROR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "type" "Roles" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "LogType" NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_userId_key" ON "Role"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Log_userId_key" ON "Log"("userId");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
