import React, { createContext, useEffect, useState } from "react";
import { config } from "@/config/config";
import { OrderLineType } from "@/typing/types";

export interface TotalOrderLineType {
  confirmed: OrderLineType[];
  unconfirmed: OrderLineType[];
}

interface OrderContextType {
  orderLines: TotalOrderLineType;
  setOrderLines: React.Dispatch<React.SetStateAction<TotalOrderLineType>>;
}

const OrderContext = createContext<OrderContextType>({
  orderLines: { confirmed: [], unconfirmed: [] },
  setOrderLines: () => {},
});

interface Props {
  children: React.ReactNode;
}

export function OrderContextProvider({ children }: Props) {
  const [orderLines, setOrderLines] = useState<TotalOrderLineType>({
    confirmed: [],
    unconfirmed: [],
  });

  useEffect(() => {
    const orderlists = localStorage.getItem("orderlists");
    if (orderlists) {
      const orderlistsArr = JSON.parse(orderlists);
      setOrderLines(orderlistsArr);
    }
  }, []);

  useEffect(() => {
    if (orderLines.confirmed.length || orderLines.unconfirmed.length) {
      localStorage.setItem("orderlists", JSON.stringify(orderLines));
    }
    if (orderLines.confirmed.length > 0) {
      const preparingAndPendingIds = orderLines.confirmed
        .filter(
          (item) =>
            item.orderStatus === "PREPARING" || item.orderStatus === "PENDING"
        )
        .map((item) => item.id);
      localStorage.setItem(
        "PendingAndPreparingOrderIds",
        JSON.stringify(preparingAndPendingIds)
      );
    }
  }, [orderLines]);

  return (
    <OrderContext.Provider value={{ orderLines, setOrderLines }}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderContext;
