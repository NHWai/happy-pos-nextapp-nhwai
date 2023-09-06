/*
  Warnings:

  - You are about to drop the column `order_status` on the `orderlines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orderlines" DROP COLUMN "order_status";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
