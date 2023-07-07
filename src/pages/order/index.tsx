import OrderLayout from "@/components/OrderLayout";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import RouterLink from "next/link";

const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "background.paper",
  textAlign: "center",
  marginTop: "2rem",
};

const categoryList = ["main course", "popular", "dessert", "soup", "appetizer"];

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const OrderApp = () => {
  const { query } = useRouter();
  console.log({ query });
  return (
    <OrderLayout>
      <Box
        sx={{
          width: "90%",
          maxWidth: "300px",
          marginX: "auto",
          display: "flex",
          flexDirection: "column",
          marginTop: "1rem",
        }}
      >
        <Typography variant="h5" align="center">
          Make Your Orders Here!!
        </Typography>
        <List sx={style} component="nav" aria-label="mailbox folders">
          {categoryList.map((el, idx) => (
            <div key={el}>
              <ListItem button component={RouterLink} href={`/order/${el}`}>
                <ListItemText primary={capitalize(el)} align="center" />
              </ListItem>
              {categoryList.length - 1 !== idx && <Divider />}
            </div>
          ))}
        </List>
      </Box>
    </OrderLayout>
  );
};

export default OrderApp;
