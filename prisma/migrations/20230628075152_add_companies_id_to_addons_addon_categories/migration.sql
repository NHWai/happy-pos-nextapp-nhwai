/*
  Warnings:

  - Added the required column `companies_id` to the `addon_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companies_id` to the `addons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addon_categories" ADD COLUMN     "companies_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "addons" ADD COLUMN     "companies_id" INTEGER NOT NULL;
