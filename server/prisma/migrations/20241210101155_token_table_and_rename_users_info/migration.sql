/*
  Warnings:

  - You are about to drop the `UsersInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH', 'EMAIL_VERIFY', 'PASSWORD_RESET', 'INVITATION');

-- DropForeignKey
ALTER TABLE "UsersInfo" DROP CONSTRAINT "UsersInfo_userId_fkey";

-- DropIndex
DROP INDEX "GroupMembership_groupId_userId_idx";

-- DropIndex
DROP INDEX "Team_name_idx";

-- DropTable
DROP TABLE "UsersInfo";

-- CreateTable
CREATE TABLE "SummonerInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rank" "Rank" NOT NULL,
    "division" "Division" NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "SummonerInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SummonerInfo_userId_key" ON "SummonerInfo"("userId");

-- CreateIndex
CREATE INDEX "GroupMembership_groupId_userId_role_idx" ON "GroupMembership"("groupId", "userId", "role");

-- CreateIndex
CREATE INDEX "Team_name_createdById_idx" ON "Team"("name", "createdById");

-- AddForeignKey
ALTER TABLE "SummonerInfo" ADD CONSTRAINT "SummonerInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
