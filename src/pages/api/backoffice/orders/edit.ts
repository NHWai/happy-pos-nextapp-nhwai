import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import { OrderStatus } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session && session?.user?.email && req.method === "PUT") {
    const { orderId, order_status, is_paid } = JSON.parse(req.body);

    if (!Array.isArray(orderId) || orderId.length === 0) {
      return res.status(400).end();
    }
    try {
      //updating orderstatus
      if (order_status !== undefined && typeof order_status === "string") {
        await prisma.orders.updateMany({
          where: { id: { in: orderId } },
          data: { order_status: order_status as OrderStatus },
        });
      }

      if (is_paid !== undefined && typeof is_paid === "boolean") {
        await prisma.orders.updateMany({
          where: { id: { in: orderId } },
          data: { is_paid: is_paid },
        });
      }

      res.status(200).end();
    } catch (error) {
      res.status(500).end();
    }
  } else {
    res.status(401).end();
  }
}
