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

    //create location
    const newLocation = await prisma.locations.create({
      data: {
        name: data.name,
        address: data.address,
        companies_id: data.companyId,
      },
    });

    res.status(201).json(newLocation);
  } else {
    res.status(401).end();
  }
}
