import type { OrderStatus } from "@prisma/client";

interface BaseType {
  id: number;
  name: string;
}

export type Status = "idle" | "loading" | "failed";

export interface Menu extends BaseType {
  price: number;
  asset_url?: string;
  description?: string;
  menuCategoryArr: {
    id: number;
  }[];
  locationArr: { is_available: boolean; id: number }[];
  addonCategoryArr: { id: number }[];
}

export interface OrderMenu extends BaseType {
  price: number;
  asset_url?: string;
  description?: string;
  menuCategoryArr: {
    id: number;
  }[];
  addonCategoryArr: { id: number }[];
}

export interface MenuCategory extends BaseType {
  companies_id?: number;
}

export interface Addon extends BaseType {
  price: number;
  is_available: boolean;
  addon_categories_id: number;
  companies_id: number;
}

export interface AddonCategory extends BaseType {
  is_required: boolean;
}

export interface Location extends BaseType {
  address: string;
  companies_id?: number;
}

export interface Table extends BaseType {
  asset_url: string;
  locations_id: number;
}

export interface MenusMenuCategoriesLocations {
  id: number;
  menus_id?: number;
  menu_categories_id: number;
  locations_id: number;
}

export interface Company extends BaseType {
  address: string;
  error: string;
  status: Status;
}

export interface ContextType {
  status: Status;
  error: string;
}

export interface LocationsType extends ContextType {
  items: Location[];
}

export interface MenuCategoriesType extends ContextType {
  items: MenuCategory[];
}

export interface MenusType extends ContextType {
  items: Menu[];
}

export interface OrderLineType {
  id: number;
  name: string;
  price: number;
  qty: number;
  addons: string[];
  formData: {};
  isConfirm: boolean;
  orderStatus: OrderStatus;
}

export interface BackOfficeOrderlines {
  orders_id: number;
  tables_id: number;
  is_paid: boolean;
  price: number | null;
  addons_id: number[];
  menus_id: number;
  order_status: OrderStatus;
  locations_id: number;
  quantity: number;
}

export interface BackofficeOrderlinesType {
  items: BackOfficeOrderlines[];
  status: Status;
  error: string;
}
