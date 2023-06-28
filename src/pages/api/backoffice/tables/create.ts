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

    //create table
    const newTable = await prisma.tables.create({
      data: {
        name: data.name,
        locations_id: data.locationId,
        asset_url: "",
      },
    });

    if (!newTable.id) return res.status(500).end();

    //upload the qr image and get url of that qr
    await qrcodeUpload(newTable.locations_id, newTable.id);

    const qrUrl = getQrCodeUrl(newTable.locations_id, newTable.id);

    //update the assetUrl of the table

    const updatedTable = await prisma.tables.update({
      where: { id: newTable.id },
      data: { asset_url: qrUrl },
    });

    if (!updatedTable) return res.status(500).end();

    return res.status(201).json(updatedTable);
  } else {
    return res.status(401).end();
  }
}
