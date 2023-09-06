/*
  Warnings:

  - Made the column `menus_id` on table `menus_addon_categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `addon_categories_id` on table `menus_addon_categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `menus_id` on table `menus_menu_categories_locations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "menus_addon_categories" ALTER COLUMN "menus_id" SET NOT NULL,
ALTER COLUMN "addon_categories_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "menus_menu_categories_locations" ALTER COLUMN "menus_id" SET NOT NULL;
