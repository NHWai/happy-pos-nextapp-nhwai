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

    //check the new addon is not in archived
    const archivedAddon = await prisma.addons.findFirst({
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
    if (archivedAddon?.id) {
      const newAddon = await prisma.addons.update({
        where: { id: archivedAddon.id },
        data: {
          companies_id: data.companies_id,
          name: data.name,
          price: data.price,
          addon_categories_id: data.addon_categories_id,
          is_available: data.is_available,
          is_archived: false,
        },
      });
      return res.status(201).json(newAddon);
    }

    //create new addon
    const newAddon = await prisma.addons.create({
      data: {
        companies_id: data.companies_id,
        name: data.name,
        price: data.price,
        addon_categories_id: data.addon_categories_id,
        is_available: data.is_available,
      },
    });

    if (!newAddon) {
      return res.status(500).end();
    }
    return res.status(201).json(newAddon);
  } else {
    return res.status(401).end();
  }
}
