import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //getLocationId
  const locationId = Number(req.query.locationId);

  if (!locationId) {
    return res.send(400);
  }

  const menusMenuCategoryLocationsIds =
    await prisma.menus_menu_categories_locations.findMany({
      where: {
        locations_id: locationId,
        is_available: true,
      },
      select: {
        menu_categories_id: true,
      },
      distinct: ["menu_categories_id"],
    });

  if (!menusMenuCategoryLocationsIds.length) {
    return res.send(500);
  }

  const menuCategories = await prisma.menu_categories.findMany({
    where: {
      id: {
        in: menusMenuCategoryLocationsIds.map(
          (item) => item.menu_categories_id
        ),
      },
      is_archived: false,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return res.status(200).json(menuCategories);
}
