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

    //check the new menucategory is not in archived
    const archivedMenuCat = await prisma.menu_categories.findFirst({
      where: {
        companies_id: data.companyId,
        is_archived: true,
        name: {
          equals: data.name,
          mode: "insensitive",
        },
      },
      select: { name: true, id: true },
    });

    //if it's archived, set is_archived false
    if (archivedMenuCat?.id) {
      const newMenuCategory = await prisma.menu_categories.update({
        where: { id: archivedMenuCat.id },
        data: {
          name: data.name,
          companies_id: data.companyId,
          is_archived: false,
        },
      });
      return res.status(201).json(newMenuCategory);
    }

    //create menu-category
    const newMenuCategory = await prisma.menu_categories.create({
      data: {
        name: data.name,
        companies_id: data.companyId,
      },
    });

    if (!newMenuCategory) {
      return res.status(500).end();
    }

    return res.status(201).json(newMenuCategory);
  } else {
    return res.status(401).end();
  }
}
