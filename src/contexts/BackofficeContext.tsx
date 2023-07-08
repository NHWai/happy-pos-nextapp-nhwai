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
  MenusType,
  Status,
  Table,
} from "@/typing/types";

import { createContext, ReactNode, useEffect, useState } from "react";

interface AppType {
  locations: Location[];
  menus: Menu[];
  menuCategories: MenuCategory[];
  tables: Table[];
  addonCategories: AddonCategory[];
  addons: Addon[];
  status: Status;
  error: string;
}

interface BackOfficeContextType {
  app: AppType;
  setApp: React.Dispatch<React.SetStateAction<AppType>>;
  fetchCompany: (companyName: string) => void;
  company: Company;
}

const initialApp: AppType = {
  locations: [],
  menus: [],
  menuCategories: [],
  addonCategories: [],
  addons: [],
  tables: [],
  status: "idle",
  error: "",
};

//
const BackOfficeContext = createContext<BackOfficeContextType>({
  app: initialApp,
  setApp: () => {},
  fetchCompany: (companyName: string) => {},
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

  const fetchCompany = async (companyName: string) => {
    try {
      const response = await fetch(`${config.baseurl}/backoffice/companies`, {
        method: "POST",
        body: companyName,
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
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

  const fetchApp = async (companyId: string) => {
    try {
      const res = await fetch(
        `${config.baseurl}/backoffice/app?companyId=${companyId}`
      );

      if (res.ok) {
        const {
          menus,
          locations,
          menuCategories,
          tables,
          addonCategories,
          addons,
        } = await res.json();
        setApp({
          menus,
          locations,
          menuCategories,
          addonCategories,
          addons,
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
        app,
        setApp,
        fetchCompany,
        company,
      }}
    >
      {children}
    </BackOfficeContext.Provider>
  );
};

export default BackOfficeContext;
