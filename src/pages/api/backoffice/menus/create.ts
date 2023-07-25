import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import { upload } from "@/config/upload";
import { Request, Response } from "express";
import type { menus } from "@prisma/client";

// Create a custom type for the combined request
type CustomRequest = NextApiRequest & Request & { files: any };
type CustomResponse = NextApiResponse & Response;

// disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export function runMiddleware(
  req: NextApiRequest & { [key: string]: any },
  res: NextApiResponse,
  fn: (...args: any[]) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        reject(result);
        return res.status(500).end();
      }

      return resolve(result);
    });
  });
}

export default async function uploadHandler(
  req: CustomRequest,
  res: CustomResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session && session.user?.email) {
    //

    try {
      await runMiddleware(req, res, upload);
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
        selectedAddonCategories: { name: string; id: number }[];
      } = {
        name: req.body.name,
        price: parseInt(req.body.price, 10),
        selectedLocations: JSON.parse(req.body.selectedLocations),
        selectedMenuCategories: JSON.parse(req.body.selectedMenuCategories),
        companyId: parseInt(req.body.companyId, 10),
        selectedAddonCategories: JSON.parse(req.body.selectedAddonCategories),
      };

      //check the new menuc is not in archived
      const archivedMenu = await prisma.menus.findFirst({
        where: {
          companies_id: reqBody.companyId,
          is_archived: true,
          name: {
            equals: reqBody.name,
            mode: "insensitive",
          },
        },
        select: { name: true, id: true },
      });

      let newMenu: menus = {
        asset_url: "",
        companies_id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "",
        price: 0,
        description: "",
        id: 0,
        is_archived: false,
      };

      //if it's archived, set is_archived false
      if (archivedMenu?.id) {
        newMenu = await prisma.menus.update({
          where: { id: archivedMenu.id },
          data: {
            name: reqBody.name,
            price: reqBody.price,
            asset_url: menuUrl,
            companies_id: reqBody.companyId,
            is_archived: false,
          },
        });
      } else {
        // create a new menu
        newMenu = await prisma.menus.create({
          data: {
            name: reqBody.name,
            price: reqBody.price,
            asset_url: menuUrl,
            companies_id: reqBody.companyId,
          },
        });
      }

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

      //inserting in menus_addon_categories table
      const addonsMenus = reqBody.selectedAddonCategories.map((el) => ({
        menus_id: newMenu.id,
        addon_categories_id: el.id,
      }));

      await prisma.menus_addon_categories.createMany({
        data: addonsMenus,
      });

      const menuCategoryArr = reqBody.selectedMenuCategories.map((item) => ({
        id: item.id,
      }));
      const locationArr = reqBody.selectedLocations.map((item) => ({
        id: item.id,
        is_available: item.is_available,
      }));
      const addonCategoryArr = reqBody.selectedAddonCategories.map((item) => ({
        id: item.id,
      }));

      return res
        .status(201)
        .json({ ...newMenu, menuCategoryArr, locationArr, addonCategoryArr });
    } catch (err) {
      return res.status(500).end();
    }
  } else {
    return res.status(401).end();
  }
}

// export default async function uploadHandler(
//   req: CustomRequest,
//   res: CustomResponse
// ) {
//   const session = await getServerSession(req, res, authOptions);

//   if (session && session?.user?.email) {
//     try {
//       upload(req, res, async (err: any) => {
//         if (err) {
//           return res.status(400).json({ message: "Error uploading file" });
//         }

//         // File uploaded successfully
//         const files = req.files as Express.MulterS3.File[];
//         let menuUrl =
//           "https://msquarefdc.sgp1.digitaloceanspaces.com/happy-pos/nhwai/1687062252572_default.jfif";
//         if (files.length > 0) {
//           const file = files[0];
//           menuUrl = file.location;
//         }

//         const reqBody: {
//           name: string;
//           companyId: number;
//           price: number;
//           selectedLocations: {
//             id: number;
//             name: string;
//             is_available: boolean;
//           }[];
//           selectedMenuCategories: { name: string; id: number }[];
//           selectedAddonCategories: { name: string; id: number }[];
//         } = {
//           name: req.body.name,
//           price: parseInt(req.body.price, 10),
//           selectedLocations: JSON.parse(req.body.selectedLocations),
//           selectedMenuCategories: JSON.parse(req.body.selectedMenuCategories),
//           companyId: parseInt(req.body.companyId, 10),
//           selectedAddonCategories: JSON.parse(req.body.selectedAddonCategories),
//         };

//         //check the new menuc is not in archived
//         const archivedMenu = await prisma.menus.findFirst({
//           where: {
//             companies_id: reqBody.companyId,
//             is_archived: true,
//             name: {
//               equals: reqBody.name,
//               mode: "insensitive",
//             },
//           },
//           select: { name: true, id: true },
//         });

//         let newMenu: menus = {
//           asset_url: "",
//           companies_id: 0,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           name: "",
//           price: 0,
//           description: "",
//           id: 0,
//           is_archived: false,
//         };

//         //if it's archived, set is_archived false
//         if (archivedMenu?.id) {
//           newMenu = await prisma.menus.update({
//             where: { id: archivedMenu.id },
//             data: {
//               name: reqBody.name,
//               price: reqBody.price,
//               asset_url: menuUrl,
//               companies_id: reqBody.companyId,
//               is_archived: false,
//             },
//           });
//         } else {
//           // create a new menu
//           newMenu = await prisma.menus.create({
//             data: {
//               name: reqBody.name,
//               price: reqBody.price,
//               asset_url: menuUrl,
//               companies_id: reqBody.companyId,
//             },
//           });
//         }

//         const menusMenuCategoriesLocationsIdArr = reqBody.selectedLocations
//           .map((location) =>
//             reqBody.selectedMenuCategories.map((category) => ({
//               menus_id: newMenu.id,
//               menu_categories_id: category.id,
//               locations_id: location.id,
//               is_available: location.is_available,
//             }))
//           )
//           .flat();

//         //inserting in menus_menu_categories_locations table
//         await prisma.menus_menu_categories_locations.createMany({
//           data: menusMenuCategoriesLocationsIdArr,
//         });

//         //inserting in menus_addon_categories table
//         const addonsMenus = reqBody.selectedAddonCategories.map((el) => ({
//           menus_id: newMenu.id,
//           addon_categories_id: el.id,
//         }));

//         await prisma.menus_addon_categories.createMany({
//           data: addonsMenus,
//         });

//         const menuCategoryArr = reqBody.selectedMenuCategories.map((item) => ({
//           id: item.id,
//         }));
//         const locationArr = reqBody.selectedLocations.map((item) => ({
//           id: item.id,
//           is_available: item.is_available,
//         }));
//         const addonCategoryArr = reqBody.selectedAddonCategories.map(
//           (item) => ({
//             id: item.id,
//           })
//         );

//         return res
//           .status(201)
//           .json({ ...newMenu, menuCategoryArr, locationArr, addonCategoryArr });
//       });
//     } catch (error) {
//       return res.status(500).end();
//     }
//   } else {
//     return res.status(401).end();
//   }
// }

// uploadHandler = ()
