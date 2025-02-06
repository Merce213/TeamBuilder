/*
  Warnings:

  - A unique constraint covering the columns `[nameId]` on the table `Champion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nameId` to the `Champion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Champion" ADD COLUMN     "nameId" VARCHAR(30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Champion_nameId_key" ON "Champion"("nameId");
