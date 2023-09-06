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

    const companyId = Number(query.companyId);

    if (!companyId) {
      return res.end(404);
    }

    const menus = await prisma.menus.findMany({
      where: {
        companies_id: companyId,
      },
    });

    const menusMenuCategoryLocationsIds =
      await prisma.menus_menu_categories_locations.findMany();

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

    res.status(200).json(menusArr);
    // res.send(200);
    //return the array of menuCategories
  } else {
    res.status(401).end();
  }
}
