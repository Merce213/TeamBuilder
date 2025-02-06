/*
  Warnings:

  - A unique constraint covering the columns `[teamId,userId,championId,lane]` on the table `TeamMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TeamMembership_teamId_championId_lane_key";

-- DropIndex
DROP INDEX "TeamMembership_teamId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembership_teamId_userId_championId_lane_key" ON "TeamMembership"("teamId", "userId", "championId", "lane");
