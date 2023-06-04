interface BaseType {
  id: number;
  name: string;
}

export interface Menu extends BaseType {
  price: number;
  asset_url?: string;
  description?: string;
}

export interface MenuCategory extends BaseType {}

export interface Addon extends BaseType {
  price: number;
  isAvailable: boolean;
  addonCategoriesIds: string[];
}

export interface AddonCategory extends BaseType {
  isRequired: boolean;
}

export interface Location extends BaseType {
  address?: string;
  companies_id?: number;
}

export interface MenusMenuCategoriesLocations {
  id: number;
  menus_id?: number;
  menu_categories_id: number;
  locations_id: number;
}

export interface Company extends BaseType {
  address: string;
}
