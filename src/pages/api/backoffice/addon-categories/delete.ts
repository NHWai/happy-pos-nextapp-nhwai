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

    const id = Number(req.query.id);
    if (!id) {
      return res.status(400).end();
    }

    //delete menus_addon_categories table
    await prisma.menus_addon_categories.deleteMany({
      where: { addon_categories_id: id },
    });

    //delete addons related to this addon catgory
    await prisma.addons.updateMany({
      where: { addon_categories_id: id },
      data: {
        is_archived: true,
      },
    });

    //delete addonCategory
    const delAddonCatgory = await prisma.addon_categories.update({
      where: { id },
      data: {
        is_archived: true,
      },
    });
    if (!delAddonCatgory.id) return res.status(500).end();

    res.status(200).end();
  } else {
    res.status(401).end();
  }
}
