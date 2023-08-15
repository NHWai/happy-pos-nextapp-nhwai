import React, { createContext, useEffect, useState } from "react";
import { config } from "@/config/config";
import {
  Addon,
  AddonCategory,
  OrderMenu,
  MenuCategory,
  Status,
  Location,
  OrderLineType,
} from "@/typing/types";

interface AppContextType {
  menus: OrderMenu[];
  menuCategories: MenuCategory[];
  addons: Addon[];
  addonCategories: AddonCategory[];
  location: Location;
  tableId: number;
  status: Status;
  error: string;
}

interface OrderContextType {
  app: AppContextType;
  orderLines: OrderLineType[];
  setOrderLines: React.Dispatch<React.SetStateAction<OrderLineType[]>>;
  getMenusByLocationId: (locationId: number) => void;
}

const initialApp: AppContextType = {
  menus: [],
  menuCategories: [],
  addons: [],
  addonCategories: [],
  location: { id: 0, name: "", address: "", companies_id: 0 },
  tableId: 0,
  status: "idle",
  error: "",
};

const OrderContext = createContext<OrderContextType>({
  app: initialApp,
  orderLines: [],
  setOrderLines: () => {},
  getMenusByLocationId: (locationId: number) => {},
});

interface Props {
  children: React.ReactNode;
}

export function OrderContextProvider({ children }: Props) {
  const [app, setApp] = useState<AppContextType>(initialApp);
  const [orderLines, setOrderLines] = useState<OrderLineType[]>([]);

  useEffect(() => {
    const orderlists = localStorage.getItem("orderlists");
    if (orderlists) {
      const orderlistsArr = JSON.parse(orderlists);
      setOrderLines(orderlistsArr);
    }
  }, []);

  async function getMenusByLocationId(locationId: number) {
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
        tableId: Number(localStorage.getItem("OrdertableId")),
      });
    } catch (error) {
      setApp((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
    }
  }

  return (
    <OrderContext.Provider
      value={{ app, getMenusByLocationId, orderLines, setOrderLines }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderContext;
