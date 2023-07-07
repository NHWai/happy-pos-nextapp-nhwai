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

    //get menu_ids before del
    let menuIdsBeforeDel = (
      await prisma.menus_menu_categories_locations.findMany({
        where: { menu_categories_id: id },
        select: {
          menus_id: true,
        },
      })
    )
      .map((item) => item.menus_id)
      .filter((menu, idx, arr) => arr.indexOf(menu) === idx);

    //delete menus , menu categories and locations
    await prisma.menus_menu_categories_locations.deleteMany({
      where: { menu_categories_id: id },
    });

    //menus_id after delete
    const menuIdsAfterDel = (
      await prisma.menus_menu_categories_locations.findMany({
        where: { menus_id: { in: menuIdsBeforeDel } },
      })
    )
      .map((item) => item.menus_id)
      .filter((item, idx, arr) => arr.indexOf(item) === idx);

    const menuIdToDel = menuIdsBeforeDel.filter(
      (item1) => !menuIdsAfterDel.find((item2) => item1 === item2)
    );

    //del menus
    await prisma.menus.updateMany({
      where: { id: { in: menuIdToDel } },
      data: {
        is_archived: true,
      },
    });

    //delete menu category
    const delMenuCatgory = await prisma.menu_categories.update({
      where: { id },
      data: {
        is_archived: true,
      },
    });

    if (!delMenuCatgory.id) return res.status(500).end();

    res.status(200).end();
  } else {
    res.status(401).end();
  }
}
