// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session && session?.user?.email) {
    //check session
    const query = req.query;

    const companyId = Number(query.company);

    if (!companyId) {
      return res.end(404);
    }

    const menuCategories = await prisma.menu_categories.findMany({
      where: {
        companies_id: companyId,
      },
    });

    res.status(200).json(menuCategories);
    //return the array of menuCategories
  } else {
    res.status(401).end();
  }
}
