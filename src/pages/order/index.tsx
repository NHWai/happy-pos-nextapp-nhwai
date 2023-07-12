import React, { useContext, useEffect } from "react";
import OrderLayout from "@/components/OrderLayout";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import RouterLink from "next/link";
import OrderContext from "@/contexts/OrderContext";

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
  const { app, getMenusByLocationId } = useContext(OrderContext);
  const { query } = useRouter();

  useEffect(() => {
    if (query.locationId) {
      localStorage.setItem("OrderlocationId", query.locationId as string);
      localStorage.setItem("OrdertableId", query.tableId as string);
    }
    const locationId = Number(localStorage.getItem("OrderlocationId"));
    if (locationId && locationId !== app.location.id) {
      getMenusByLocationId(locationId);
    }
  }, [query.locationId]);

  useEffect(() => {
    if (app.status === "failed") alert("Failed to load data from server");
  }, [app.status]);

  return (
    <OrderLayout height={`calc(100vh - 64px)`}>
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
          {app.status === "loading" ? (
            <CircularProgress />
          ) : (
            <>
              {app.menuCategories.map((el, idx) => (
                <div key={el.name}>
                  <ListItem
                    button
                    component={RouterLink}
                    href={`/order/${el.name}`}
                  >
                    <ListItemText
                      primary={capitalize(el.name)}
                      sx={{ textAlign: "center" }}
                    />
                  </ListItem>
                  {categoryList.length - 1 !== idx && <Divider />}
                </div>
              ))}
            </>
          )}
        </List>
      </Box>
    </OrderLayout>
  );
};

export default OrderApp;
