import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import { upload } from "@/config/upload";
import { Request, Response } from "express";
import { isArray } from "util";

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

      const reqBody: {
        name: string;
        companyId: number;
        menuId: number;
        price: number;
        removeItems: {
          menus_id: number;
          menu_categories_id: number;
          locations_id: number;
          is_available: boolean;
        }[];
        addItems: {
          menus_id: number;
          menu_categories_id: number;
          locations_id: number;
          is_available: boolean;
        }[];
        addonCategoryIds: number[];
      } = {
        name: req.body.name,
        price: parseInt(req.body.price, 10),
        menuId: parseInt(req.body.menuId, 10),
        removeItems: JSON.parse(req.body.removeItems),
        addItems: JSON.parse(req.body.addItems),
        companyId: parseInt(req.body.companyId, 10),
        addonCategoryIds: JSON.parse(req.body.addonCategoryIds),
      };

      const menusAddonCategories = reqBody.addonCategoryIds.map((item) => ({
        menus_id: reqBody.menuId,
        addon_categories_id: item,
      }));

      //removing old rows in menus_addon_categories table
      await prisma.menus_addon_categories.deleteMany({
        where: { menus_id: reqBody.menuId },
      });

      //adding new rows in menus_addon_categories table
      await prisma.menus_addon_categories.createMany({
        data: menusAddonCategories,
      });

      const addonCategoryArr = reqBody.addonCategoryIds.map((item) => ({
        id: item,
      }));

      //removing old rows in menus_menu_categories_locations table
      await prisma.$transaction(
        reqBody.removeItems.map(
          (item: {
            menus_id: number;
            menu_categories_id: number;
            locations_id: number;
            is_available: boolean;
          }) =>
            prisma.menus_menu_categories_locations.delete({
              where: {
                menusMenuCategoriesLocations: {
                  menus_id: item.menus_id,
                  menu_categories_id: item.menu_categories_id,
                  locations_id: item.locations_id,
                },
              },
            })
        )
      );

      //adding new items in  menus_menu_categories_locations table
      await prisma.menus_menu_categories_locations.createMany({
        data: reqBody.addItems,
      });

      const editedMenuMenuCategoryLocation =
        await prisma.menus_menu_categories_locations.findMany({
          where: { menus_id: reqBody.menuId },
        });

      const menuCategoryArr = editedMenuMenuCategoryLocation
        .map((item) =>
          JSON.stringify({
            id: item.menu_categories_id,
          })
        )
        .filter((item, idx, arr) => arr.indexOf(item) === idx)
        .map((item) => JSON.parse(item));

      const locationArr = editedMenuMenuCategoryLocation
        .map((item) =>
          JSON.stringify({
            id: item.locations_id,
            is_available: item.is_available,
          })
        )
        .filter((item, idx, arr) => arr.indexOf(item) === idx)
        .map((item) => JSON.parse(item));

      if (files.length > 0) {
        const file = files[0];
        const menuUrl = file.location;
        //update a new menu uploading new image
        const updateMenu = await prisma.menus.update({
          where: {
            id: reqBody.menuId,
          },
          data: {
            name: reqBody.name,
            price: reqBody.price,
            asset_url: menuUrl,
          },
        });
        res.status(200).json({ ...updateMenu, menuCategoryArr, locationArr });
      }
      //update a new menu without uploading new image
      const updateMenu = await prisma.menus.update({
        where: {
          id: reqBody.menuId,
        },
        data: {
          name: reqBody.name,
          price: reqBody.price,
        },
      });
      res.status(200).json({
        ...updateMenu,
        menuCategoryArr,
        locationArr,
        addonCategoryArr,
      });
    });
  } else {
    res.status(401).end();
  }
}
