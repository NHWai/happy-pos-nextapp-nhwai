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
  console.log("session", session);

  if (session && session?.user?.email) {
    //check session
    const query = req.query;
    const locationId = Number(query.location);

    const menuCategoriesLocationsMenus =
      await prisma.menus_menu_categories_locations.findMany({
        where: { locations_id: locationId },
      });
    console.log(menuCategoriesLocationsMenus);

    if (menuCategoriesLocationsMenus.length === 0) {
      //create a newMenuCategory named Uncategorized
      const newMenuCategory = await prisma.menu_categories.create({
        data: {
          name: "Uncategorized",
        },
      });

      //insert in menus_menu_categories_locations table
      await prisma.menus_menu_categories_locations.create({
        data: {
          locations_id: locationId,
          menu_categories_id: newMenuCategory.id,
        },
      });

      res.status(200).json([newMenuCategory]);
    } else {
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
    }

    res.send(200);
  } else {
    res.status(401).end();
  }
}
