import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const locationId = Number(req.query.locationId);
  if (!locationId) {
    res.status(400).end();
  }

  const location = await prisma.locations.findUnique({
    where: { id: locationId },
  });

  const menusMenuCategoryLocationsIds =
    await prisma.menus_menu_categories_locations.findMany({
      where: {
        locations_id: locationId,
      },
    });

  if (menusMenuCategoryLocationsIds.length === 0) {
    return res.status(500).end();
  }

  const menuIds = menusMenuCategoryLocationsIds.map((item) => item.menus_id);
  const menuCategoryIds = menusMenuCategoryLocationsIds.map(
    (item) => item.menu_categories_id
  );
  const menus = await prisma.menus.findMany({
    where: { id: { in: menuIds } },
  });

  const menuCategories = await prisma.menu_categories.findMany({
    where: { id: { in: menuCategoryIds } },
  });

  const menusAddonCategories = await prisma.menus_addon_categories.findMany({
    where: {
      menus_id: { in: menuIds },
    },
  });

  const addonCategories = await prisma.addon_categories.findMany({
    where: {
      id: { in: menusAddonCategories.map((item) => item.addon_categories_id) },
    },
  });

  const addons = await prisma.addons.findMany({
    where: {
      addon_categories_id: {
        in: menusAddonCategories.map((item) => item.addon_categories_id),
      },
    },
  });

  const menusArr = menus.map((el) => ({
    ...el,
    menuCategoryArr: menusMenuCategoryLocationsIds
      .filter((item) => item.menus_id === el.id)
      .map((item) =>
        JSON.stringify({
          id: item.menu_categories_id,
        })
      )
      .filter((item, idx, arr) => arr.indexOf(item) === idx)
      .map((item) => JSON.parse(item)),

    addonCategoryArr: menusAddonCategories
      .filter((item) => item.menus_id === el.id)
      .map((item) => JSON.stringify({ id: item.addon_categories_id }))
      .filter((item, idx, arr) => arr.indexOf(item) === idx)
      .map((item) => JSON.parse(item)),
  }));

  const response = {
    menus: menusArr,
    menuCategories,
    addonCategories,
    addons,
    location,
  };

  res.status(200).json(response);
}
