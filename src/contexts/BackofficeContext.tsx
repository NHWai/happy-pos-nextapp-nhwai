import { config } from "@/config/config";
import {
  Addon,
  AddonCategory,
  Company,
  Location,
  LocationsType,
  Menu,
  MenuCategoriesType,
  MenuCategory,
  MenusMenuCategoriesLocations,
  MenusType,
  Status,
  Table,
} from "@/typing/types";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AppType {
  locations: Location[];
  menus: Menu[];
  menuCategories: MenuCategory[];
  tables: Table[];
  addonCategories: AddonCategory[];
  status: Status;
  error: string;
}

interface BackOfficeContextType {
  app: AppType;
  setApp: React.Dispatch<React.SetStateAction<AppType>>;
  fetchCompany: (companyName: string) => void;
  // menus: MenusType;
  // setMenus: React.Dispatch<React.SetStateAction<MenusType>>;
  // fetchMenus: (companyId: number) => void;
  // getMenusByLocationsId: (locationId: string) => void;
  // menuCategories: MenuCategoriesType;
  // getMenuCategoriesBycompanyId: (companyId: number) => void;
  // setMenuCategories: React.Dispatch<React.SetStateAction<MenuCategoriesType>>;
  // addons: Addon[];
  // addonCategories: AddonCategory[];
  // getLocationsByCompanyId: (companyId: number) => void;
  // locations: LocationsType;
  // setLocations: React.Dispatch<React.SetStateAction<LocationsType>>;
  // menusMenuCategoriesLocations: MenusMenuCategoriesLocations[];
  company: Company;
}

const initialLocations: LocationsType = {
  items: [],
  status: "idle",
  error: "",
};

const initialMenuCategories: MenuCategoriesType = {
  items: [],
  status: "idle",
  error: "",
};

const initialMenuContext: MenusType = {
  items: [],
  status: "idle",
  error: "",
};

const initialApp: AppType = {
  locations: [],
  menus: [],
  menuCategories: [],
  addonCategories: [],
  tables: [],
  status: "idle",
  error: "",
};

//
const BackOfficeContext = createContext<BackOfficeContextType>({
  app: initialApp,
  setApp: () => {},
  fetchCompany: (companyName: string) => {},
  // menus: initialMenuContext,
  // setMenus: () => {},
  // fetchMenus: () => {},
  // getMenusByLocationsId: (locationId) => {},
  // menuCategories: initialContext,
  // getMenuCategoriesBycompanyId: (companyId) => {},
  // setMenuCategories: () => {},
  // addons: [],
  // addonCategories: [],
  // locations: initialContext,
  // getLocationsByCompanyId: (companyId) => {},
  // setLocations: () => {},
  company: { id: 0, address: "", name: "", error: "" },
});

interface Props {
  children: ReactNode;
}

export const BackOfficeContextProvider = ({ children }: Props) => {
  const [app, setApp] = useState<AppType>(initialApp);

  const [company, setCompany] = useState<Company>({
    id: 0,
    address: "",
    name: "",
    error: "",
  });

  useEffect(() => {
    const localStorageCompany = localStorage.getItem("company");
    if (localStorageCompany && company.id === 0) {
      const parsedCompany = JSON.parse(localStorageCompany);
      if (parsedCompany.id !== company.id) {
        setCompany({ ...parsedCompany });
        fetchApp(parsedCompany.id);
        console.log("fetch from frontend", company.id);
      }
    }
  }, [company.id]);

  const [locations, setLocations] = useState<LocationsType>(initialLocations);

  const [menuCategories, setMenuCategories] = useState<MenuCategoriesType>(
    initialMenuCategories
  );

  const [menus, setMenus] = useState<MenusType>(initialMenuContext);

  const fetchMenus = async (companyId: number) => {
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/menus?companyId=${companyId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMenus((pre) => ({ items: data, error: "", status: "idle" }));
      } else {
        throw new Error("Failed to fetch menus");
      }
    } catch (error) {
      setMenus((pre) => ({ ...pre, error: error as string, status: "failed" }));
    }
  };

  const fetchCompany = async (companyName: string) => {
    try {
      const response = await fetch(`${config.baseurl}/backoffice/companies`, {
        method: "POST",
        body: companyName,
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("company", JSON.stringify(data));
        setCompany({ ...data, error: "" });
        fetchApp(data.id);
      } else {
        throw new Error("Fail to fetch company id");
      }
    } catch (error) {
      setCompany((pre) => ({ ...pre, error: error as string }));
    }
  };

  const getLocationsByCompanyId = async (companyId: number) => {
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/locations?companyId=${companyId}`,
        {
          method: "GET",
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setLocations((pre) => ({
          ...pre,
          items: data,
          status: "idle",
          error: "",
        }));
      } else {
        throw new Error(`can't fetch locations `);
      }
    } catch (err) {
      setLocations((pre) => ({
        ...pre,
        status: "failed",
        error: err as string,
      }));
    }
  };

  const getMenuCategoriesBycompanyId = async (companyId: number) => {
    const url = `${config.baseurl}/backoffice/menu-categories?company=${companyId}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMenuCategories((pre) => ({
          ...pre,
          items: data,
          status: "idle",
          error: "",
        }));
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      setMenuCategories((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
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

  const fetchApp = async (companyId: string) => {
    try {
      const res = await fetch(
        `${config.baseurl}/backoffice/app?companyId=${companyId}`
      );

      if (res.ok) {
        const { menus, locations, menuCategories, tables, addonCategories } =
          await res.json();
        setApp({
          menus,
          locations,
          menuCategories,
          addonCategories,
          tables,
          status: "idle",
          error: "",
        });
      } else {
        throw new Error("error fetching app data");
      }
    } catch (error) {
      setApp((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
    }
  };

  return (
    <BackOfficeContext.Provider
      value={{
        // fetchApp,
        app,
        setApp,
        fetchCompany,
        // menus,
        // setMenus,
        // fetchMenus,
        // getMenusByLocationsId,
        company,
        // locations,
        // getLocationsByCompanyId,
        // setLocations,
        // menuCategories,
        // setMenuCategories,
        // getMenuCategoriesBycompanyId,
      }}
    >
      {children}
    </BackOfficeContext.Provider>
  );
};

export default BackOfficeContext;
