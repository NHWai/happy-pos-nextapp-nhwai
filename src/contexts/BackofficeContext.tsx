import { config } from "@/config/config";
import {
  Addon,
  AddonCategory,
  Company,
  Location,
  Menu,
  MenuCategory,
  MenusMenuCategoriesLocations,
} from "@/typing/types";
import { createContext, ReactNode, useEffect, useState } from "react";

interface BackOfficeContextType {
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  getMenusByLocationsId: (locationId: string) => void;
  menuCategories: MenuCategory[];
  getMenuCategoriesByLocationId: (locationId: string) => void;
  setMenuCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  // addons: Addon[];
  // addonCategories: AddonCategory[];
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  // menusMenuCategoriesLocations: MenusMenuCategoriesLocations[];
  company: Company;
}

//
const BackOfficeContext = createContext<BackOfficeContextType>({
  menus: [],
  setMenus: () => {},
  getMenusByLocationsId: (locationId) => {},
  menuCategories: [],
  getMenuCategoriesByLocationId: (locationId) => {},
  setMenuCategories: () => {},
  // addons: [],
  // addonCategories: [],
  locations: [],
  setLocations: () => {},
  // menusMenuCategoriesLocations: [],
  company: { id: 0, address: "", name: "" },
});

interface Props {
  children: ReactNode;
}

export const BackOfficeContextProvider = ({ children }: Props) => {
  const [company, setCompany] = useState<Company>({
    id: 0,
    address: "",
    name: "",
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);

  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    localStorage.removeItem("companyId");
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`${config.baseurl}/backoffice/companies`);
      const data = await response.json();
      if (response.status === 200 || 201) {
        localStorage.setItem("companyId", data.id);
        setCompany(data);
      } else {
        throw new Error("Fail to fetch company id");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMenuCategoriesByLocationId = async (locationId: string) => {
    const url = `${config.baseurl}/backoffice/menu-categories?location=${locationId}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMenuCategories(data);
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMenusByLocationsId = async (locationId: string) => {
    const url = `${config.baseurl}/backoffice/menus?location=${locationId}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMenus(data);
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BackOfficeContext.Provider
      value={{
        menus,
        setMenus,
        getMenusByLocationsId,
        company,
        locations,
        setLocations,
        menuCategories,
        setMenuCategories,
        getMenuCategoriesByLocationId,
      }}
    >
      {children}
    </BackOfficeContext.Provider>
  );
};

export default BackOfficeContext;
