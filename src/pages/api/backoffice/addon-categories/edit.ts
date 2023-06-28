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
    const reqdata = JSON.parse(req.body);

    //update addon-category
    const updatedAddonCategory = await prisma.addon_categories.update({
      where: { id: reqdata.id },
      data: {
        name: reqdata.name,
        is_required: reqdata.is_required,
      },
    });

    if (!updatedAddonCategory) {
      return res.status(500).end();
    }

    return res.status(200).json(updatedAddonCategory);
  } else {
    return res.status(401).end();
  }
}
