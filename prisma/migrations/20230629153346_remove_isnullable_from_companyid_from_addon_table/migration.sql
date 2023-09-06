/*
  Warnings:

  - Made the column `is_available` on table `addons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "addons" ALTER COLUMN "is_available" SET NOT NULL;
