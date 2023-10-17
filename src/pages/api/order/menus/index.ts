import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //getMenuCategoryId
  const menuCategoryId = Number(req.query.menuCategoryId);

  //getLocationId
  const locationId = Number(req.query.locationId);

  if (!menuCategoryId || !locationId) {
    return res.send(400);
  }

  const menuCategory = await prisma.menu_categories.findUnique({
    where: {
      id: menuCategoryId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const menuIds = await prisma.menus_menu_categories_locations.findMany({
    where: {
      menu_categories_id: menuCategoryId,
      locations_id: locationId,
      is_available: true,
    },
    select: {
      menus_id: true,
    },
  });

  const menus = await prisma.menus.findMany({
    where: {
      id: {
        in: menuIds.map((item) => item.menus_id),
      },
      is_archived: false,
    },
    select: {
      name: true,
      price: true,
      asset_url: true,
      id: true,
    },
  });

  return res.status(200).json({ menus, menuCategory });
}
