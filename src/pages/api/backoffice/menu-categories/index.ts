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
    const locationId = Number(query.location);

    const menuCategoriesLocationsMenus =
      await prisma.menus_menu_categories_locations.findMany({
        where: { locations_id: locationId },
      });

    //return the related menuCategories
    const menuCategoryIds = menuCategoriesLocationsMenus.map(
      (item) => item.menu_categories_id
    );
    const menuCategories = await prisma.menu_categories.findMany({
      where: {
        id: { in: menuCategoryIds },
      },
    });
    res.status(200).json(menuCategories);
    //return the array of menuCategories
  } else {
    res.status(401).end();
  }
}
