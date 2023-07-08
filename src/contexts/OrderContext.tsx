import React, { createContext, useState } from "react";
import { config } from "@/config/config";
import {
  Addon,
  AddonCategory,
  OrderMenu,
  MenuCategory,
  Status,
} from "@/typing/types";

interface AppContextType {
  menus: OrderMenu[];
  menuCategories: MenuCategory[];
  addons: Addon[];
  addonCategories: AddonCategory[];
  status: Status;
  error: string;
}

interface OrderContextType {
  app: AppContextType;
  getMenusByLocationId: (locationId: number) => void;
}

const initialApp: AppContextType = {
  menus: [],
  menuCategories: [],
  addons: [],
  addonCategories: [],
  status: "idle",
  error: "",
};

const OrderContext = createContext<OrderContextType>({
  app: initialApp,
  getMenusByLocationId: (locationId: number) => {},
});

interface Props {
  children: React.ReactNode;
}

export function OrderContextProvider({ children }: Props) {
  const [app, setApp] = useState<AppContextType>(initialApp);

  async function getMenusByLocationId(locationId: number) {
    console.log("fetch order app ");
    setApp((pre) => ({
      ...pre,
      status: "loading",
    }));
    try {
      const response = await fetch(
        `${config.baseurl}/order/app?locationId=${locationId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch menus by location id");
      }

      const data = await response.json();
      setApp({
        ...data,
        error: "",
        status: "idle",
      });
    } catch (error) {
      setApp((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
    }
  }

  console.log("order context runs");

  return (
    <OrderContext.Provider value={{ app, getMenusByLocationId }}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderContext;
