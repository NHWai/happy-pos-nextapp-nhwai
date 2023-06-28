import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import { qrcodeUpload, getQrCodeUrl } from "@/config/upload";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session && session?.user?.email) {
    //if session exists
    const data = JSON.parse(req.body);

    //update the assetUrl of the table

    const updatedTable = await prisma.tables.update({
      where: { id: data.id },
      data: { name: data.name },
    });

    if (!updatedTable) return res.status(500).end();

    return res.status(201).json(updatedTable);
  } else {
    return res.status(401).end();
  }
}
