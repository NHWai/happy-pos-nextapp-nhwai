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

    //check the new addonCategory is not in archived
    const archivedAddonCat = await prisma.addon_categories.findFirst({
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
    if (archivedAddonCat?.id) {
      const newAddonCategory = await prisma.addon_categories.update({
        where: { id: archivedAddonCat.id },
        data: {
          name: data.name,
          companies_id: data.companyId,
          is_required: data.is_required,
          is_archived: false,
        },
      });
      return res.status(201).json(newAddonCategory);
    }

    //create menu-category
    const newAddonCategory = await prisma.addon_categories.create({
      data: {
        name: data.name,
        companies_id: data.companyId,
        is_required: data.is_required,
      },
    });

    if (!newAddonCategory) {
      return res.status(500).end();
    }
    console.log(newAddonCategory);
    return res.status(201).json(newAddonCategory);
  } else {
    return res.status(401).end();
  }
}
