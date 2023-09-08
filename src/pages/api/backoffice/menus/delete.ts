import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import cloudinary from "@/config/cloudinary";

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

    //getMenuImage
    const menuToDel = await prisma.menus.findUnique({
      where: { id },
    });
    const imgToDel = menuToDel?.asset_url || "";
    let publicId = imgToDel.split("nextjs-uploads/").pop()?.split(".")[0];
    publicId = "nextjs-uploads/" + publicId;
    const defaultImg = "nextjs-uploads/jyumli1sfg9t4b4qcyck";
    if (publicId && defaultImg !== publicId) {
      const resCloudinary = await cloudinary.uploader.destroy(publicId);
      if (resCloudinary.result !== "ok") return res.status(400).end();
    }

    //delete menus and menu categories
    await prisma.menus_menu_categories_locations.deleteMany({
      where: { menus_id: id },
    });

    //delete menu
    const delMenu = await prisma.menus.update({
      where: { id },
      data: { is_archived: true },
    });
    if (!delMenu.id) return res.status(500).end();
    res.status(200).end();
  } else {
    res.status(401).end();
  }
}
