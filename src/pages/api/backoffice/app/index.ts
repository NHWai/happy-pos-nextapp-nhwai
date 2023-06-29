// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import { json } from "stream/consumers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user?.name && session.user.email) {
    const companyId = Number(req.query.companyId);

    if (!companyId) return res.send(404);

    //fetching menus
    const menus = await prisma.menus.findMany({
      where: {
        companies_id: companyId,
      },
    });

    //fetching menus_menu_categories_locations relationship
    const menusMenuCategoryLocationsIds =
      await prisma.menus_menu_categories_locations.findMany();

    //fetching menus_addon_categories relationship
    const menusAddonCategories = await prisma.menus_addon_categories.findMany();

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
      },
    });

    //fetching locations
    const locations = await prisma.locations.findMany({
      where: { companies_id: companyId },
    });

    //fetching tables
    const tables = await prisma.tables.findMany({
      where: { locations_id: { in: locations.map((item) => item.id) } },
    });

    //fetching addonCategories
    const addonCategories = await prisma.addon_categories.findMany({
      where: { companies_id: companyId },
    });

    // if (locations.length === 0) {
    //   //create a location with given company_id

    //   const newLocation = await prisma.locations.create({
    //     data: {
    //       name: "default location",
    //       address: "default address",
    //       companies_id: companyId,
    //     },
    //   });
    //   res.status(200).json([newLocation]);
    // } else {
    //   // if location exits return the info of that location
    //   res.status(200).json(locations);
    // }

    const response = {
      menus: menusArr,
      menuCategories,
      addonCategories,
      locations,
      tables,
    };
    console.log("request from frontend");
    res.status(200).json(response);
  } else {
    return res.status(404).end();
  }
}
