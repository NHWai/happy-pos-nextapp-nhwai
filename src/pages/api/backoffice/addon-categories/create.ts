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
    const data = JSON.parse(req.body);

    //create menu-category
    const newAddonCategory = await prisma.addon_categories.create({
      data: {
        name: data.name,
        companies_id: data.companyId,
        is_required: data.is_required,
      },
    });

    if (!newAddonCategory) {
      return res.status(500).end();
    }
    console.log(newAddonCategory);
    return res.status(201).json(newAddonCategory);
  } else {
    return res.status(401).end();
  }
}
