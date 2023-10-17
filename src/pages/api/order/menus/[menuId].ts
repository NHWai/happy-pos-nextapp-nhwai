import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const menuId = Number(req.query.menuId);
  if (Number.isNaN(menuId) && menuId == undefined) {
    return res.send(400);
  }

  const menu = await prisma.menus.findUnique({
    where: {
      id: menuId,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const addonCategoryIds = await prisma.menus_addon_categories.findMany({
    where: {
      menus_id: menuId,
    },
    select: {
      addon_categories_id: true,
    },
  });

  const addonCategories = await prisma.addon_categories.findMany({
    where: {
      id: {
        in: addonCategoryIds.map((item) => item.addon_categories_id),
      },
      is_archived: false,
    },
    select: {
      id: true,
      name: true,
      is_required: true,
      addons: true,
    },
  });

  interface InitialType {
    required: typeof addonCategories;
    optional: typeof addonCategories;
  }

  const initial: InitialType = {
    required: [],
    optional: [],
  };

  const totalAddonCategories = addonCategories.reduce((prev, curr) => {
    if (curr.is_required) {
      prev.required.push(curr);
    } else {
      prev.optional.push(curr);
    }
    return prev;
  }, initial);

  const responseBody = { totalAddonCategories, menu };

  return res.status(200).json(responseBody);
}
