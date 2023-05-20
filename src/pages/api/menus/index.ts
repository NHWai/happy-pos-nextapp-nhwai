// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import type { NextApiRequest, NextApiResponse } from "next";

interface Menu {
  id: number;
  name: string;
  price: number;
  menu_url: null | string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Menu[]>
) {
  const result = await db.query("select * from menus", []);
  res.status(200).json(result.rows);
}
