-- CreateTable
CREATE TABLE "addon_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_required" BOOLEAN DEFAULT false,

    CONSTRAINT "addon_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "is_available" BOOLEAN DEFAULT true,
    "addon_categories_id" INTEGER NOT NULL,

    CONSTRAINT "addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT 'Default address',

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "companies_id" INTEGER NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "menu_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "asset_url" TEXT,
    "description" TEXT,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus_addon_categories" (
    "id" SERIAL NOT NULL,
    "menus_id" INTEGER,
    "addon_categories_id" INTEGER,

    CONSTRAINT "menus_addon_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus_locations" (
    "id" SERIAL NOT NULL,
    "menus_id" INTEGER NOT NULL,
    "locations_id" INTEGER NOT NULL,
    "is_available" BOOLEAN DEFAULT true,

    CONSTRAINT "menus_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus_menu_categories" (
    "id" SERIAL NOT NULL,
    "menus_id" INTEGER,
    "menu_categories_id" INTEGER,

    CONSTRAINT "menu_menu_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "companies_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "addons" ADD CONSTRAINT "addons_addon_categories_id_fkey" FOREIGN KEY ("addon_categories_id") REFERENCES "addon_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_companies_id_fkey" FOREIGN KEY ("companies_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_addon_categories" ADD CONSTRAINT "menus_addon_categories_addon_categories_id_fkey" FOREIGN KEY ("addon_categories_id") REFERENCES "addon_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_addon_categories" ADD CONSTRAINT "menus_addon_categories_menus_id_fkey" FOREIGN KEY ("menus_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_locations" ADD CONSTRAINT "menus_locations_locations_id_fkey" FOREIGN KEY ("locations_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_locations" ADD CONSTRAINT "menus_locations_menus_id_fkey" FOREIGN KEY ("menus_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_menu_categories" ADD CONSTRAINT "menu_menu_categories_menu_categories_id_fkey" FOREIGN KEY ("menu_categories_id") REFERENCES "menu_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_menu_categories" ADD CONSTRAINT "menu_menu_categories_menus_id_fkey" FOREIGN KEY ("menus_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companies_id_fkey" FOREIGN KEY ("companies_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
