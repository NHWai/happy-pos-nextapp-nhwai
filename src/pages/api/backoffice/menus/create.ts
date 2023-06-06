import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import upload from "@/config/upload";
import { Request, Response } from "express";

// Create a custom type for the combined request
type CustomRequest = NextApiRequest & Request & { files: any };
type CustomResponse = NextApiResponse & Response;

// disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function uploadHandler(
  req: CustomRequest,
  res: CustomResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session && session?.user?.email) {
    upload(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading file" });
      }

      // File uploaded successfully
      const files = req.files as Express.MulterS3.File[];
      const file = files[0];
      const menuUrl = file.location;

      const { name, price, locationId, menuCategoryId } = req.body;
      console.log(req.body);
      console.log(menuUrl);

      // create a new menu
      const newMenu = await prisma.menus.create({
        data: {
          name,
          price: Number(price),
          asset_url: menuUrl,
        },
      });

      //insert in menus_menu_categories_locations table;

      await prisma.menus_menu_categories_locations.update({
        where: {
          menuCategoriesLocations: {
            locations_id: Number(locationId),
            menu_categories_id: Number(menuCategoryId),
          },
        },
        data: {
          menus_id: newMenu.id,
        },
      });

      // const me

      res.status(201).json(newMenu);
    });
  } else {
    res.send(401);
  }
}
