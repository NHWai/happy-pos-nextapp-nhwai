import MenuCard from "@/components/MenuCard";
import OrderLayout from "@/components/OrderLayout";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const menuItemList = [
  "Mote-hin-ghar",
  "shan-noodle",
  "pel nan pyar",
  "moke lat saung",
];
const imgUrl =
  "https://media-cdn.tripadvisor.com/media/photo-p/1d/05/85/a5/laminarosa-or-give-a.jpg";
export default function MenuItem() {
  const router = useRouter();
  console.log(router.pathname);
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
        {menuItemList.map((item) => (
          <MenuCard key={item} name={item} url={imgUrl} />
        ))}
      </Box>
    </OrderLayout>
  );
}
