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

    const menusLocationsMenus =
      await prisma.menus_menu_categories_locations.findMany({
        where: { locations_id: locationId },
      });

    //return the related menuCategories
    const menuIds = menusLocationsMenus
      .map((item) => item.menus_id)
      .filter((item) => item);
    console.log({ menuIds });
    const menus = await prisma.menus.findMany({
      where: {
        id: { in: menuIds as number[] },
      },
    });
    res.status(200).json(menus);
    //return the array of menuCategories
  } else {
    res.status(401).end();
  }
}
