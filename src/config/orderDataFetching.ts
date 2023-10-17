import { config } from "./config";
import type { addons as AddonType } from "@prisma/client";

export interface OrderAddonCategory {
  addons: AddonType[];
  id: number;
  name: string;
  is_required: boolean | null;
}
[];

export interface OrderMenuCategoryItemType {
  id: number;
  name: string;
}

export interface FetchOrderMenusByIdType {
  menu: { name: string; price: number; id: number };
  totalAddonCategories: {
    required: OrderAddonCategory[];
    optional: OrderAddonCategory[];
  };
}

export interface OrderMenuItemType {
  id: number;
  name: string;
  price: number;
  asset_url: string;
}

export async function fetchOrderMenuCategories(
  locationId: string
): Promise<OrderMenuCategoryItemType[]> {
  try {
    // Fetch data based on the context (request parameters)
    const response = await fetch(
      `${config.baseurl}/order/menu-categories/?locationId=${locationId}`
    );
    if (response.ok) {
      const data = await response.json();
      return data as OrderMenuCategoryItemType[];
    } else {
      throw new Error("API request failed");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function fetchOrderMenus(
  locationId: string,
  menuCategoryId: string
): Promise<{
  menus: OrderMenuItemType[];
  menuCategory: OrderMenuCategoryItemType;
}> {
  try {
    // Fetch data based on the context (request parameters)
    const response = await fetch(
      `${config.baseurl}/order/menus/?locationId=${locationId}&menuCategoryId=${menuCategoryId}`
    );
    if (response.ok) {
      const data = await response.json();
      return data as {
        menus: OrderMenuItemType[];
        menuCategory: OrderMenuCategoryItemType;
      };
    } else {
      throw new Error("API request failed");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export const fetchOrderMenusById = async (
  menuId: string
): Promise<FetchOrderMenusByIdType> => {
  try {
    const response = await fetch(`${config.baseurl}/order/menus/${menuId}`);
    if (response.ok) {
      const data = await response.json();
      return data as FetchOrderMenusByIdType;
    } else {
      throw new Error("API request failed");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// export const fetchOrderStatusByTableId = async(tableId:string): Promise<FetchOrderMenusByIdType> {

// }
