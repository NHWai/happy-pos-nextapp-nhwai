import { config } from "@/config/config";
import {
  Addon,
  AddonCategory,
  BackofficeOrderlinesType,
  Company,
  Location,
  Menu,
  MenuCategory,
  Status,
  Table,
} from "@/typing/types";

import { createContext, ReactNode, useEffect, useState } from "react";

export interface AppType {
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
  selectedLocation: Location;
  setSelectedLocation: React.Dispatch<React.SetStateAction<Location>>;
  backofficeOrderlines: BackofficeOrderlinesType;
  setBackofficeOrderlines: React.Dispatch<
    React.SetStateAction<BackofficeOrderlinesType>
  >;
  getOrders: (locationId?: number) => void;
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

export const initialLocation: Location = {
  id: 0,
  name: "",
  address: "",
  companies_id: 0,
};

const initialBackOfficeOrderlines: BackofficeOrderlinesType = {
  items: [],
  error: "",
  status: "idle",
};

const initialCompany: Company = {
  id: 0,
  address: "",
  name: "",
  error: "",
  status: "idle",
};

//
const BackOfficeContext = createContext<BackOfficeContextType>({
  app: initialApp,
  setApp: () => {},
  selectedLocation: initialLocation,
  setSelectedLocation: () => {},
  backofficeOrderlines: initialBackOfficeOrderlines,
  setBackofficeOrderlines: () => [],
  getOrders: (locationId?: number) => {},
  fetchCompany: (companyName: string) => {},
  company: initialCompany,
});

interface Props {
  children: ReactNode;
}

export const BackOfficeContextProvider = ({ children }: Props) => {
  const [app, setApp] = useState<AppType>(initialApp);

  const [company, setCompany] = useState<Company>(initialCompany);

  const [selectedLocation, setSelectedLocation] =
    useState<Location>(initialLocation);

  const [backofficeOrderlines, setBackofficeOrderlines] =
    useState<BackofficeOrderlinesType>(initialBackOfficeOrderlines);

  useEffect(() => {
    const localStorageCompany = localStorage.getItem("company");
    if (localStorageCompany && company.id === 0) {
      const parsedCompany = JSON.parse(localStorageCompany);
      if (parsedCompany.id !== company.id) {
        setCompany({ ...parsedCompany });
        fetchApp(parsedCompany.id);
        // console.log("fetch from frontend", company.id);
      }
    }
  }, [company.id]);

  const fetchCompany = async (companyName: string) => {
    setCompany((pre) => ({ ...pre, status: "loading", error: "" }));
    try {
      const response = await fetch(`${config.baseurl}/backoffice/companies`, {
        method: "POST",
        body: companyName,
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("company", JSON.stringify(data));
        setCompany({ ...data, error: "", status: "idle" });
        fetchApp(data.id);
      } else {
        throw new Error("Fail to fetch company id");
      }
    } catch (error) {
      setCompany((pre) => ({
        ...pre,
        error: error as string,
        status: "failed",
      }));
    }
  };

  const getOrders = async (locationId?: number) => {
    setBackofficeOrderlines((pre) => ({ ...pre, status: "loading" }));
    console.log("getting orders from frontend");
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/orders?locationId=${locationId}`
      );
      if (response.status) {
        const data = await response.json();
        setBackofficeOrderlines((pre) => ({
          items: data,
          status: "idle",
          error: "",
        }));
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (err) {
      setBackofficeOrderlines((pre) => ({
        ...pre,
        status: "failed",
        error: err as string,
      }));
    }
  };

  const fetchApp = async (companyId: string) => {
    setApp((pre) => ({ ...pre, status: "loading" }));
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
        selectedLocation,
        setSelectedLocation,
        backofficeOrderlines,
        setBackofficeOrderlines,
        getOrders,
        fetchCompany,
        company,
      }}
    >
      {children}
    </BackOfficeContext.Provider>
  );
};

export default BackOfficeContext;
