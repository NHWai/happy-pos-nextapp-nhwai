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
  // menus: Menu[];
  // menuCategories: MenuCategory[];
  // addons: Addon[];
  // addonCategories: AddonCategory[];
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  // menusMenuCategoriesLocations: MenusMenuCategoriesLocations[];
  company: Company;
}

//
const BackOfficeContext = createContext<BackOfficeContextType>({
  // menus: [],
  // menuCategories: [],
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

  useEffect(() => {
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

    const companyIdFromLocalStorgae = Number(localStorage.getItem("companyId"));
    if (companyIdFromLocalStorgae) {
      setCompany({
        ...company,
        id: companyIdFromLocalStorgae,
      });
    } else if (company.id === 0) {
      fetchCompany();
    }
  }, []);

  return (
    <BackOfficeContext.Provider value={{ company, locations, setLocations }}>
      {children}
    </BackOfficeContext.Provider>
  );
};

export default BackOfficeContext;
