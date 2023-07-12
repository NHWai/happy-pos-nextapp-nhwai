import OrderLayout from "@/components/OrderLayout";
import { Box, Button, Typography, ButtonBase } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import OrderContext from "@/contexts/OrderContext";
import OrderCard from "@/components/OrderCard";

const dummydata = [
  {
    name: "fried noodle",
    price: 4000,
    qty: 4,
    addons: ["Super Big"],
  },
];

export default function myorder() {
  const { orderLines, setOrderLines, app } = useContext(OrderContext);
  const router = useRouter();

  const handleDelete = (idx: number) => {
    const newOrderLines = JSON.parse(JSON.stringify(orderLines));
    newOrderLines.splice(idx, 1);
    console.log({ newOrderLines });
    console.log({ orderLines });
    setOrderLines(newOrderLines);
    // setOrderLines((pre) => [...pre.slice(0, idx), ...pre.slice(idx + 1)]);
  };

  const handleEdit = (idx: number) => {
    const menuItemName = orderLines[idx].name;
    const menuItemId = app.menus.find((menu) => menu.name === menuItemName)?.id;
    router.push(`/order/menus/${menuItemId}?orderlineidx=${idx}`);
  };

  const getMenuPrice = (menuItem: string) => {
    return app.menus.find((item) => item.name === menuItem)?.price;
  };

  const getAddonPrice = (addonItem: string) => {
    return app.addons.find((item) => item.name === addonItem)?.price;
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
      <Typography variant="h4" align="center" sx={{ marginBottom: "2rem" }}>
        My Orders
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: "300px",
        }}
      >
        {orderLines.map((item, idx) => {
          return (
            <OrderCard
              key={idx}
              handleDelete={() => handleDelete(idx)}
              handleEdit={() => handleEdit(idx)}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" fontWeight={"1rem"}>
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={"1rem"}
                  fontStyle={"italic"}
                >
                  {getMenuPrice(item.name)} MMK
                </Typography>
              </Box>

              <ul
                style={{
                  marginRight: "0px",
                  marginLeft: "0px",
                  paddingRight: "0px",
                }}
              >
                <Typography variant="body1">Addons</Typography>
                {item.addons.map((addon, idx) => {
                  return (
                    <li style={{ marginLeft: "1.5rem" }} key={idx}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2">{addon}</Typography>
                        <Typography
                          variant="body2"
                          fontWeight={"1rem"}
                          fontStyle={"italic"}
                        >
                          {getAddonPrice(addon)} MMK
                        </Typography>
                      </Box>
                    </li>
                  );
                })}
              </ul>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" fontWeight={"1rem"}>
                  Qty
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={"1rem"}
                  fontStyle={"italic"}
                >
                  {item.qty} Nos
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" fontWeight={"1rem"}>
                  Total
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={"bold"}
                  fontStyle={"italic"}
                >
                  {item.price} MMK
                </Typography>
              </Box>
            </OrderCard>
          );
        })}
      </Box>
    </OrderLayout>
  );
}
