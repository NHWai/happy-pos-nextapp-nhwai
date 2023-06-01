/*
  Warnings:

  - You are about to drop the `menus_locations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menus_menu_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "menus_locations" DROP CONSTRAINT "menus_locations_locations_id_fkey";

-- DropForeignKey
ALTER TABLE "menus_locations" DROP CONSTRAINT "menus_locations_menus_id_fkey";

-- DropForeignKey
ALTER TABLE "menus_menu_categories" DROP CONSTRAINT "menu_menu_categories_menu_categories_id_fkey";

-- DropForeignKey
ALTER TABLE "menus_menu_categories" DROP CONSTRAINT "menu_menu_categories_menus_id_fkey";

-- DropTable
DROP TABLE "menus_locations";

-- DropTable
DROP TABLE "menus_menu_categories";

-- CreateTable
CREATE TABLE "menus_menu_categories_locations" (
    "id" SERIAL NOT NULL,
    "menus_id" INTEGER,
    "menu_categories_id" INTEGER NOT NULL,
    "locations_id" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL,

    CONSTRAINT "menus_menu_categories_locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "menus_menu_categories_locations" ADD CONSTRAINT "menus_menu_categories_locations_menu_categories_id_fkey" FOREIGN KEY ("menu_categories_id") REFERENCES "menu_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_menu_categories_locations" ADD CONSTRAINT "menus_menu_categories_locations_menus_id_fkey" FOREIGN KEY ("menus_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
