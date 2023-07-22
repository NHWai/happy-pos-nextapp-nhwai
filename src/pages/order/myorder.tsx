import OrderLayout from "@/components/OrderLayout";
import { Box, Button, Typography, ButtonBase } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import OrderContext from "@/contexts/OrderContext";
import OrderCard from "@/components/OrderCard";
import { config } from "@/config/config";
import { OrderLineType } from "@/typing/types";
import { OrderStatus } from "@prisma/client";

// use as a utility to run once for updateStatus function in useEffect hook
let count = 0;

export default function myorder() {
  const { orderLines, setOrderLines, app, getMenusByLocationId } =
    useContext(OrderContext);
  const router = useRouter();

  useEffect(() => {
    if (!app.location.id) {
      const locationId = localStorage.getItem("OrderlocationId");
      getMenusByLocationId(Number(locationId));
    }
    if (orderLines.length === 0) {
      const localStorageOrderlines = localStorage.getItem("orderlists");
      localStorageOrderlines &&
        setOrderLines(JSON.parse(localStorageOrderlines));
    }
  }, []);

  useEffect(() => {
    if (orderLines.length > 0 && orderLines[0].id) {
      const notCompleteOrderIdArr = orderLines
        .filter(
          (item) =>
            item.orderStatus === "PENDING" || item.orderStatus === "PREPARING"
        )
        .map((item) => item.id);
      if (notCompleteOrderIdArr.length > 0 && count === 0) {
        updateOrderStatus(notCompleteOrderIdArr);
      }
    }
  }, [orderLines]);

  const handleDelete = (idx: number) => {
    const newOrderLines = JSON.parse(JSON.stringify(orderLines));
    newOrderLines.splice(idx, 1);
    setOrderLines(newOrderLines);
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

  const chgMenuNametoId = (name: string): number =>
    app.menus.find((menu) => menu.name === name)?.id as number;

  const chgAddonNametoId = (name: string): number =>
    app.addons.find((addon) => addon.name === name)?.id as number;

  const confirmOrder = async () => {
    const orderlinesArr = orderLines.map((item) => ({
      menuId: chgMenuNametoId(item.name),
      price: item.price,
      qty: item.qty,
      addonIdArr: item.addons.map((addon) => chgAddonNametoId(addon)),
    }));
    const locationId = Number(localStorage.getItem("OrderlocationId"));
    const tableId = Number(localStorage.getItem("OrdertableId"));

    try {
      const response = await fetch(`${config.baseurl}/order`, {
        method: "POST",
        body: JSON.stringify({ orderlinesArr, locationId, tableId }),
      });
      if (response.status) {
        const data = await response.json();

        const newOrderlines = orderLines.map((item, idx) => ({
          ...item,
          id: data[idx].id,
        }));
        localStorage.setItem("orderlists", JSON.stringify(newOrderlines));
        setOrderLines(newOrderlines);
      } else {
        throw new Error("Order can't be confirmed");
      }
    } catch (error) {
      alert(error);
    }
  };

  const updateOrderStatus = async (orderIdArr: number[]) => {
    count++;
    const body = JSON.stringify(orderIdArr);

    try {
      const response = await fetch(`${config.baseurl}/order`, {
        method: "PUT",
        body,
      });
      if (response.ok) {
        const data: { id: number; order_status: OrderStatus }[] =
          await response.json();

        const oldData = JSON.stringify(
          orderLines
            .filter(
              (item) =>
                item.orderStatus === "PENDING" ||
                item.orderStatus === "PREPARING"
            )
            .map((item) => ({
              id: item.id,
              order_status: item.orderStatus,
            }))
        );

        //if there is updated orderstatus from backend, update orderstatus in frontend
        if (oldData !== JSON.stringify(data)) {
          const newData = data.map((item) => ({
            ...(orderLines.find(
              (order) => item.id === order.id
            ) as OrderLineType),
            orderStatus: item.order_status,
          }));

          localStorage.setItem("orderlists", JSON.stringify(newData));
          setOrderLines(newData);
        }

        //check if there is any incomplete orderstatus
        const notCompleteOrderIdArr = data
          .filter(
            (item) =>
              item.order_status === "PENDING" ||
              item.order_status === "PREPARING"
          )
          .map((item) => item.id);
        if (notCompleteOrderIdArr.length > 0) {
          setTimeout(() => updateOrderStatus(notCompleteOrderIdArr), 1000 * 30);
        } else {
          localStorage.removeItem("orderlists");
          return;
        }
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      alert(error);
    }
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
          maxWidth: "260px",
        }}
      >
        {orderLines.map((item, idx) => {
          return (
            <OrderCard
              key={idx}
              handleDelete={() => handleDelete(idx)}
              handleEdit={() => handleEdit(idx)}
              buttonDisabled={!!orderLines[0].id}
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

              {item.addons.length > 0 && (
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
              )}
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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" fontWeight={"1rem"}>
                  Order Status
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={"bold"}
                  fontStyle={"italic"}
                >
                  {item.orderStatus}
                </Typography>
              </Box>
            </OrderCard>
          );
        })}
        {orderLines.length > 0 && (
          <Button disabled={!!orderLines[0].id} onClick={confirmOrder}>
            Confirm
          </Button>
        )}
      </Box>
    </OrderLayout>
  );
}
