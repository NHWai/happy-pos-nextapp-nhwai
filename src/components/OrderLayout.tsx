import { MainLayout } from "@/components/MainLayout";
import OrderAppNavbar from "@/components/OrderAppNavbar";
import { Box } from "@mui/material";

import React from "react";
import OrderAppBottombar from "./OrderAppBottombar";

interface Props {
  children: React.ReactNode;
}

const OrderApp = ({ children }: Props) => {
  return (
    <MainLayout>
      <OrderAppNavbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingX: "1rem",
        }}
        style={{
          height: `calc(100vh - 64px - 64px)`,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
      <OrderAppBottombar />
    </MainLayout>
  );
};

export default OrderApp;