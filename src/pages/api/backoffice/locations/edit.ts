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

    //update location
    const updatedLocation = await prisma.locations.update({
      where: { id: data.id },
      data: {
        name: data.name,
        address: data.address,
        companies_id: data.companyId,
      },
    });

    if (!updatedLocation) return res.status(500).end();

    res.status(200).json(updatedLocation);
  } else {
    res.status(401).end();
  }
}
