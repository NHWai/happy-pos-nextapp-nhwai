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

    //delete menus and menu categories

    await prisma.menus_menu_categories_locations.deleteMany({
      where: { menu_categories_id: id },
    });

    //delete location
    const delMenuCatgory = await prisma.menu_categories.delete({
      where: { id },
      select: {
        id: true,
      },
    });
    if (!delMenuCatgory.id) return res.status(500).end();

    res.status(200).end();
  } else {
    res.status(401).end();
  }
}
