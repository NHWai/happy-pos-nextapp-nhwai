/*
  Warnings:

  - A unique constraint covering the columns `[name,companies_id]` on the table `menu_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,companies_id]` on the table `menus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[menu_categories_id,locations_id,menus_id]` on the table `menus_menu_categories_locations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companies_id` to the `menu_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companies_id` to the `menus` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "menus_menu_categories_locations_menu_categories_id_location_key";

-- AlterTable
ALTER TABLE "menu_categories" ADD COLUMN     "companies_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "menus" ADD COLUMN     "companies_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_name_companies_id_key" ON "menu_categories"("name", "companies_id");

-- CreateIndex
CREATE UNIQUE INDEX "menus_name_companies_id_key" ON "menus"("name", "companies_id");

-- CreateIndex
CREATE UNIQUE INDEX "menus_menu_categories_locations_menu_categories_id_location_key" ON "menus_menu_categories_locations"("menu_categories_id", "locations_id", "menus_id");

-- AddForeignKey
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_companies_id_fkey" FOREIGN KEY ("companies_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_companies_id_fkey" FOREIGN KEY ("companies_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
