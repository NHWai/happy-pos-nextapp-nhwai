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

  if (session?.user?.name && session.user.email) {
    const companyId = Number(req.query.companyId);

    if (!companyId) return res.status(404).end();

    //fetching menus
    const menus = await prisma.menus.findMany({
      where: {
        companies_id: companyId,
        is_archived: false,
      },
    });

    const menuIds = menus.map((menu) => menu.id);

    //fetching menus_menu_categories_locations relationship
    const menusMenuCategoryLocationsIds =
      await prisma.menus_menu_categories_locations.findMany({
        where: { menus_id: { in: menuIds } },
      });

    //fetching menus_addon_categories relationship
    const menusAddonCategories = await prisma.menus_addon_categories.findMany({
      where: { menus_id: { in: menuIds } },
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

      locationArr: menusMenuCategoryLocationsIds
        .filter((item) => item.menus_id === el.id)
        .map((item) =>
          JSON.stringify({
            id: item.locations_id,
            is_available: item.is_available,
          })
        )
        .filter((item, idx, arr) => arr.indexOf(item) === idx)
        .map((item) => JSON.parse(item)),
    }));

    // fetching menu-categories
    const menuCategories = await prisma.menu_categories.findMany({
      where: {
        companies_id: companyId,
        is_archived: false,
      },
    });

    //fetching locations
    const locations = await prisma.locations.findMany({
      where: { companies_id: companyId, is_archived: false },
    });

    //fetching tables
    const tables = await prisma.tables.findMany({
      where: {
        locations_id: { in: locations.map((item) => item.id) },
        is_archived: false,
      },
    });

    //fetching addonCategories
    const addonCategories = await prisma.addon_categories.findMany({
      where: { companies_id: companyId, is_archived: false },
    });

    //fetching addons
    const addons = await prisma.addons.findMany({
      where: { companies_id: companyId, is_archived: false },
    });

    const response = {
      menus: menusArr,
      menuCategories,
      addonCategories,
      addons,
      locations,
      tables,
    };
    res.status(200).json(response);
  } else {
    return res.status(404).end();
  }
}
