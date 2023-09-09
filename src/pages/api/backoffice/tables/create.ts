import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import { qrcodeUpload, getQrCodeUrl } from "@/config/upload";
import cloudinary from "@/config/cloudinary";

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
    const qrImageDataBase64Uri = await qrcodeUpload(
      newTable.locations_id,
      newTable.id
    );

    // upload to cloudinary
    const qrImg = await cloudinary.uploader.upload(
      qrImageDataBase64Uri as string,
      { folder: "food4LifeQr" }
    );

    //update the assetUrl of the table

    const updatedTable = await prisma.tables.update({
      where: { id: newTable.id },
      data: { asset_url: qrImg.secure_url },
    });

    if (!updatedTable) return res.status(500).end();

    return res.status(201).json(updatedTable);
  } else {
    return res.status(401).end();
  }
}
