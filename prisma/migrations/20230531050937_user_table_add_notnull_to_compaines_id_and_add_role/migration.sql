/*
  Warnings:

  - Made the column `address` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companies_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user',
ALTER COLUMN "companies_id" SET NOT NULL;
