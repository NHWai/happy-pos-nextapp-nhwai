// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await prisma.menus.findMany();
  // const result = await db.query("select * from menus", []);
  res.status(200).json(data);
}
