/*
  Warnings:

  - You are about to drop the column `division` on the `SummonerInfo` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `SummonerInfo` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `SummonerInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[puuid]` on the table `SummonerInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId,championId,lane]` on the table `TeamMembership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameName` to the `SummonerInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puuid` to the `SummonerInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagLine` to the `SummonerInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TeamMembership_championId_lane_key";

-- DropIndex
DROP INDEX "User_username_email_idx";

-- AlterTable
ALTER TABLE "SummonerInfo" DROP COLUMN "division",
DROP COLUMN "level",
DROP COLUMN "rank",
ADD COLUMN     "gameName" VARCHAR(18) NOT NULL,
ADD COLUMN     "puuid" TEXT NOT NULL,
ADD COLUMN     "tagLine" VARCHAR(6) NOT NULL;

-- DropEnum
DROP TYPE "Division";

-- DropEnum
DROP TYPE "Rank";

-- CreateTable
CREATE TABLE "UserFavoriteChampion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "championId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavoriteChampion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavoriteLane" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lane" "Lane" NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavoriteLane_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserFavoriteChampion_userId_championId_idx" ON "UserFavoriteChampion"("userId", "championId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteChampion_userId_championId_key" ON "UserFavoriteChampion"("userId", "championId");

-- CreateIndex
CREATE INDEX "UserFavoriteLane_userId_lane_idx" ON "UserFavoriteLane"("userId", "lane");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteLane_userId_lane_key" ON "UserFavoriteLane"("userId", "lane");

-- CreateIndex
CREATE UNIQUE INDEX "SummonerInfo_puuid_key" ON "SummonerInfo"("puuid");

-- CreateIndex
CREATE INDEX "SummonerInfo_gameName_tagLine_idx" ON "SummonerInfo"("gameName", "tagLine");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembership_teamId_championId_lane_key" ON "TeamMembership"("teamId", "championId", "lane");

-- CreateIndex
CREATE INDEX "User_id_username_email_createdAt_idx" ON "User"("id", "username", "email", "createdAt");

-- AddForeignKey
ALTER TABLE "UserFavoriteChampion" ADD CONSTRAINT "UserFavoriteChampion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteChampion" ADD CONSTRAINT "UserFavoriteChampion_championId_fkey" FOREIGN KEY ("championId") REFERENCES "Champion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteLane" ADD CONSTRAINT "UserFavoriteLane_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
