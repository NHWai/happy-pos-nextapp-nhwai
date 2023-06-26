import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import { upload } from "@/config/upload";
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
    try {
      upload(req, res, async (err: any) => {
        if (err) {
          return res.status(400).json({ message: "Error uploading file" });
        }

        // File uploaded successfully
        const files = req.files as Express.MulterS3.File[];
        let menuUrl =
          "https://msquarefdc.sgp1.digitaloceanspaces.com/happy-pos/nhwai/1687062252572_default.jfif";
        if (files.length > 0) {
          const file = files[0];
          menuUrl = file.location;
        }

        const reqBody: {
          name: string;
          companyId: number;
          price: number;
          selectedLocations: {
            id: number;
            name: string;
            is_available: boolean;
          }[];
          selectedMenuCategories: { name: string; id: number }[];
        } = {
          name: req.body.name,
          price: parseInt(req.body.price, 10),
          selectedLocations: JSON.parse(req.body.selectedLocations),
          selectedMenuCategories: JSON.parse(req.body.selectedMenuCategories),
          companyId: parseInt(req.body.companyId, 10),
        };

        // create a new menu
        const newMenu = await prisma.menus.create({
          data: {
            name: reqBody.name,
            price: reqBody.price,
            asset_url: menuUrl,
            companies_id: reqBody.companyId,
          },
        });

        const menusMenuCategoriesLocationsIdArr = reqBody.selectedLocations
          .map((location) =>
            reqBody.selectedMenuCategories.map((category) => ({
              menus_id: newMenu.id,
              menu_categories_id: category.id,
              locations_id: location.id,
              is_available: location.is_available,
            }))
          )
          .flat();

        //inserting in menus_menu_categories_locations table
        await prisma.menus_menu_categories_locations.createMany({
          data: menusMenuCategoriesLocationsIdArr,
        });

        const menuCategoryArr = reqBody.selectedMenuCategories.map((item) => ({
          id: item.id,
        }));
        const locationArr = reqBody.selectedLocations.map((item) => ({
          id: item.id,
          is_available: item.is_available,
        }));
        return res
          .status(201)
          .json({ ...newMenu, menuCategoryArr, locationArr });
      });
    } catch (error) {
      return res.status(500).end();
    }
  } else {
    return res.status(401).end();
  }
}
