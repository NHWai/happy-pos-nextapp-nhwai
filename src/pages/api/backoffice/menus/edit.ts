import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import formidable from "formidable";
import cloudinary from "@/config/cloudinary";

// Create a custom type for the combined request
// type CustomRequest = NextApiRequest & Request & { files: any };
// type CustomResponse = NextApiResponse & Response;

// disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session && session?.user?.email) {
    try {
      const form = formidable({ allowEmptyFiles: true, minFileSize: 0 });
      let fields, file, menuUrl;
      try {
        [fields, file] = await form.parse(req);

        if (file.menuImg && file.menuImg[0].size > 0) {
          const filePath = file.menuImg[0].filepath;
          const data = await cloudinary.uploader.upload(filePath as string, {
            upload_preset: "nextjs-upload-preset",
          });
          menuUrl = data.secure_url;
        }
      } catch (error) {
        console.error(error);
        res.status(400).end();
        return;
      }

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
        name: fields.name ? fields.name[0] : "",
        price: parseInt(fields.price ? fields.price[0] : "", 10),
        menuId: parseInt(fields.menuId ? fields.menuId[0] : "", 10),
        removeItems: JSON.parse(
          fields.removeItems ? fields.removeItems[0] : ""
        ),
        addItems: JSON.parse(fields.addItems ? fields.addItems[0] : ""),
        companyId: parseInt(fields.companyId ? fields.companyId[0] : "", 10),
        addonCategoryIds: JSON.parse(
          fields.addonCategoryIds ? fields.addonCategoryIds[0] : ""
        ),
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

      if (reqBody.removeItems.length > 0) {
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
      }

      //adding new items in  menus_menu_categories_locations table
      if (reqBody.addItems.length > 0) {
        await prisma.menus_menu_categories_locations.createMany({
          data: reqBody.addItems,
        });
      }

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

      if (menuUrl) {
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
        return res.status(200).json({
          ...updateMenu,
          menuCategoryArr,
          locationArr,
          addonCategoryArr,
        });
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
      return res.status(200).json({
        ...updateMenu,
        menuCategoryArr,
        locationArr,
        addonCategoryArr,
      });
    } catch (err) {
      return res.status(500).end();
    }
  } else {
    return res.status(401).end();
  }
}
