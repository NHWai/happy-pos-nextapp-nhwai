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
    //if session exists
    const reqData = JSON.parse(req.body);

    //update addon-category
    const updatedAddonCategory = await prisma.addons.update({
      where: { id: reqData.id },
      data: {
        companies_id: reqData.companies_id,
        name: reqData.name,
        price: reqData.price,
        addon_categories_id: reqData.addon_categories_id,
        is_available: reqData.is_available,
      },
    });

    if (!updatedAddonCategory) {
      return res.status(500).end();
    }

    return res.status(200).json(updatedAddonCategory);
  } else {
    return res.status(401).end();
  }
}
