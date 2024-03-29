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

    const id = Number(req.query.id);
    if (!id) {
      return res.status(400).end();
    }

    //delete addon
    const delAddon = await prisma.addons.update({
      where: { id },
      data: {
        is_archived: true,
      },
    });
    if (!delAddon.id) return res.status(500).end();

    res.status(200).end();
  } else {
    res.status(401).end();
  }
}
