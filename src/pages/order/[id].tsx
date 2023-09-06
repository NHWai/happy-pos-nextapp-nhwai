import MenuCard from "@/components/MenuCard";
import OrderLayout from "@/components/OrderLayout";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import OrderContext from "@/contexts/OrderContext";
import { OrderMenu } from "@/typing/types";

export default function MenuItem() {
  const router = useRouter();
  const { app, getMenusByLocationId } = useContext(OrderContext);

  const filteredMenuItems = (menuCat: string): OrderMenu[] => {
    const menuCatId = app.menuCategories.find(
      (item) => item.name === menuCat
    )?.id;
    const filteredItems = app.menus.filter((menu) =>
      menu.menuCategoryArr.find((item) => item.id === menuCatId)
    );
    return filteredItems;
  };

  useEffect(() => {
    if (!app.location.id) {
      const locationId = localStorage.getItem("OrderlocationId");
      getMenusByLocationId(Number(locationId));
    }
  }, []);

  return (
    <OrderLayout height={`calc(100vh - 64px)`}>
      <Button
        sx={{ alignSelf: "flex-start" }}
        onClick={() => router.back()}
        startIcon={<KeyboardBackspaceIcon />}
      >
        Go Back
      </Button>
      <Typography sx={{ margin: "1rem 0 2rem" }} variant="h4" color="secondary">
        {typeof router.query.id === "string" && router.query.id.toUpperCase()}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "space-evenly",
          paddingBottom: "1rem",
        }}
      >
        {filteredMenuItems(router.query.id as string).map((item) => (
          <MenuCard
            key={item.id}
            name={item.name}
            href={`menus/${item.id}`}
            url={item.asset_url as string}
            price={item.price}
          />
        ))}
      </Box>
    </OrderLayout>
  );
}
