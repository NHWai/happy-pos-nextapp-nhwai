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

    //check the new location is not in archived
    const archivedLoc = await prisma.locations.findFirst({
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
    if (archivedLoc?.id) {
      const newLocation = await prisma.locations.update({
        where: { id: archivedLoc.id },
        data: {
          name: data.name,
          address: data.address,
          companies_id: data.companyId,
          is_archived: false,
        },
      });
      return res.status(201).json(newLocation);
    }

    //if it isn't archived,create a new location
    const newLocation = await prisma.locations.create({
      data: {
        name: data.name,
        address: data.address,
        companies_id: data.companyId,
      },
    });

    return res.status(201).json(newLocation);
  } else {
    res.status(401).end();
  }
}
