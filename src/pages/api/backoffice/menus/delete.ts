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
    console.log({ menuId: id });

    if (!id) {
      return res.status(400).end();
    }

    //delete menus and menu categories

    await prisma.menus_menu_categories_locations.deleteMany({
      where: { menus_id: id },
    });

    //delete menu
    const delMenu = await prisma.menus.update({
      where: { id },
      data: { is_archived: true },
    });
    if (!delMenu.id) return res.status(500).end();

    res.status(200).end();
  } else {
    res.status(401).end();
  }
}
