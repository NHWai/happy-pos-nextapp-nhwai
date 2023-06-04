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
    let query = req.query;
    const companyId = Number(query.companyId);

    const locations = await prisma.locations.findMany({
      where: { companies_id: companyId },
    });

    if (locations.length === 0) {
      //create a location with given company_id

      const newLocation = await prisma.locations.create({
        data: {
          name: "default location",
          address: "default address",
          companies_id: companyId,
        },
      });
      res.status(200).json([newLocation]);
    } else {
      // if location exits return the info of that location
      res.status(200).json(locations);
    }
  } else {
    res.status(401).end();
  }
}
