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
}

export interface MenuCategory extends BaseType {
  companies_id?: number;
}

export interface Addon extends BaseType {
  price: number;
  isAvailable: boolean;
  addonCategoriesIds: string[];
}

export interface AddonCategory extends BaseType {
  isRequired: boolean;
}

export interface Location extends BaseType {
  address: string;
  companies_id?: number;
}

export interface Table extends BaseType {
  assetUrl: string;
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
