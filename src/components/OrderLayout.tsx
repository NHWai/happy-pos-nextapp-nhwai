import { MainLayout } from "@/components/MainLayout";
import OrderAppNavbar from "@/components/OrderAppNavbar";
import { Box } from "@mui/material";
import React from "react";
import OrderAppBottombar from "./OrderAppBottombar";
import OrderContext from "@/contexts/OrderContext";

interface Props {
  children: React.ReactNode;
  height?: string;
}

const OrderApp = ({ children, height }: Props) => {
  const { orderLines } = React.useContext(OrderContext);

  return (
    <MainLayout>
      <OrderAppNavbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingX: "1rem",
          paddingBottom: "64px",
        }}
        style={{
          // height: `calc(100vh - 64px  + ${height}px)`,
          height: `{height}`,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
      {(orderLines.unconfirmed.length > 0 ||
        orderLines.confirmed.length > 0) && <OrderAppBottombar />}
    </MainLayout>
  );
};

export default OrderApp;
