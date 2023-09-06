/*
  Warnings:

  - Added the required column `asset_url` to the `table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "table" ADD COLUMN     "asset_url" TEXT NOT NULL;
