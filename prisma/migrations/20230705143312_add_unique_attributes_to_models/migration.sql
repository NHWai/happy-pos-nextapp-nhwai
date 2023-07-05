/*
  Warnings:

  - A unique constraint covering the columns `[name,companies_id]` on the table `addon_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,companies_id]` on the table `addons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,companies_id]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,locations_id]` on the table `tables` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addon_categories_name_companies_id_key" ON "addon_categories"("name", "companies_id");

-- CreateIndex
CREATE UNIQUE INDEX "addons_name_companies_id_key" ON "addons"("name", "companies_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_companies_id_key" ON "locations"("name", "companies_id");

-- CreateIndex
CREATE UNIQUE INDEX "tables_name_locations_id_key" ON "tables"("name", "locations_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
