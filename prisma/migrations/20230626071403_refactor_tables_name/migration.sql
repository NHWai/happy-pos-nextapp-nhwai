/*
  Warnings:

  - You are about to drop the `table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "table" DROP CONSTRAINT "table_locations_id_fkey";

-- DropTable
DROP TABLE "table";

-- CreateTable
CREATE TABLE "tables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locations_id" INTEGER NOT NULL,
    "asset_url" TEXT NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "table_locations_id_fkey" FOREIGN KEY ("locations_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
