import MenuCard from "@/components/MenuCard";
import OrderLayout from "@/components/OrderLayout";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import OrderContext from "@/contexts/OrderContext";
import { OrderMenu } from "@/typing/types";

const imgUrl =
  "https://media-cdn.tripadvisor.com/media/photo-p/1d/05/85/a5/laminarosa-or-give-a.jpg";
export default function MenuItem() {
  const router = useRouter();
  const { app } = useContext(OrderContext);
  const filteredMenuItems = (menuCat: string): OrderMenu[] => {
    const menuCatId = app.menuCategories.find(
      (item) => item.name === menuCat
    )?.id;
    const filteredItems = app.menus.filter((menu) =>
      menu.menuCategoryArr.find((item) => item.id === menuCatId)
    );
    return filteredItems;
  };
  return (
    <OrderLayout>
      <Button
        sx={{ alignSelf: "flex-start" }}
        onClick={() => router.back()}
        startIcon={<KeyboardBackspaceIcon />}
      >
        Go Back
      </Button>
      <Typography sx={{ margin: "1rem 0 2rem" }} variant="h4">
        MenuItem : {router.query.id}
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
          <MenuCard key={item.id} name={item.name} url={imgUrl} />
        ))}
      </Box>
    </OrderLayout>
  );
}
