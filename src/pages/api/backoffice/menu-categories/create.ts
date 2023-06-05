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
    const newMenuCategory = await prisma.menu_categories.create({
      data: {
        name: data.name,
      },
    });

    //insert in menus_menuCategories_locations table
    await prisma.menus_menu_categories_locations.create({
      data: {
        menu_categories_id: newMenuCategory.id,
        locations_id: data.locationId,
      },
    });

    const menusCategoriesIds = (
      await prisma.menus_menu_categories_locations.findMany({
        where: { locations_id: data.locationId },
      })
    ).map((el) => el.menu_categories_id);

    const menuCategories = await prisma.menu_categories.findMany({
      where: { id: { in: menusCategoriesIds } },
    });

    res.status(200).json(menuCategories);
  } else {
    res.status(401).end();
  }
}