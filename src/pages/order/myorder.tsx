import OrderLayout from "@/components/OrderLayout";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import OrderContext from "@/contexts/OrderContext";
import { config } from "@/config/config";
import MyOrderList from "@/components/MyOrderList";
import type { OrderStatus } from "@prisma/client";

let count = 0;

export default function Myorder() {
  const { orderLines, setOrderLines } = useContext(OrderContext);
  const [pendingAndPreparingOrderIds, setPendingAndPreparingOrderIds] =
    useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (orderLines.confirmed.length > 0 && count < 2) {
      count = count + 1;
      // Initial fetch with a set of order IDs cached in localstorage
      const defaultOrderIds = localStorage.getItem(
        "PendingAndPreparingOrderIds"
      );
      if (defaultOrderIds) {
        const parsedDefaultOrderIds = JSON.parse(defaultOrderIds) as number[];
        if (parsedDefaultOrderIds.length > 0) {
          fetchOrders(parsedDefaultOrderIds);
        }
      }
    }
  }, [JSON.stringify(orderLines.confirmed)]);

  const fetchOrders = async (orderIds: number[]) => {
    try {
      // Fetch order data from the API route using the provided order IDs
      const queryParams = orderIds.join(",");
      const response = await fetch(
        `${config.baseurl}/order?orderids=${queryParams}`
      );
      if (response.ok) {
        const data: { id: number; order_status: OrderStatus }[] =
          await response.json();
        // Update order statuses in the state
        handleBackendResponse(data);

        // Filter order IDs for the next fetch
        const nextOrderIds = data
          .filter(
            (order) =>
              order.order_status === "PENDING" ||
              order.order_status === "PREPARING"
          )
          .map((order) => order.id);

        setPendingAndPreparingOrderIds(nextOrderIds);
        localStorage.setItem(
          "PendingAndPreparingOrderIds",
          JSON.stringify(nextOrderIds)
        );
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleBackendResponse = (
    responseData: { id: number; order_status: OrderStatus }[]
  ) => {
    // Create a copy of the current state to avoid mutating it directly
    const updatedState = [...orderLines.confirmed];

    responseData.forEach((responseItem) => {
      const { id, order_status } = responseItem;

      // Find the index of the matching item in the state based on the 'id'
      const index = updatedState.findIndex((item) => item.id === id);

      if (index !== -1) {
        // If a matching item is found, update the 'status'
        updatedState[index].orderStatus = order_status;
      }
    });

    // Update the state with the new array
    setOrderLines((pre) => ({ ...pre, confirmed: updatedState }));
  };

  const confirmOrder = async () => {
    const orderlinesArr = orderLines.unconfirmed.map((item) => ({
      menuId: item.menu.id,
      price: item.price,
      qty: item.qty,
      addonIdArr: item.addons.map((addon) => addon.id),
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
        const newConfirmedOrderLines = orderLines.unconfirmed.map(
          (item, idx) => ({
            ...item,
            id: data[idx].id,
          })
        );
        const updatedOrderLines = {
          unconfirmed: [],
          confirmed: [...orderLines.confirmed, ...newConfirmedOrderLines],
        };
        setOrderLines(updatedOrderLines);
        setPendingAndPreparingOrderIds(
          updatedOrderLines.confirmed.map((item) => item.id)
        );
      } else {
        throw new Error("Order can't be confirmed");
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
      <Typography
        variant="h4"
        align="center"
        sx={{ marginBottom: "2rem" }}
        color="secondary"
      >
        My Orders
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: "260px",
        }}
      >
        <Button
          sx={{ marginBottom: "1rem" }}
          disabled={!pendingAndPreparingOrderIds.length}
          onClick={() => fetchOrders(pendingAndPreparingOrderIds)}
        >
          Refresh
        </Button>
        {/* Unconfirmed Orders */}
        {orderLines.unconfirmed.length > 0 && (
          <MyOrderList
            list={orderLines.unconfirmed}
            confirmOrder={confirmOrder}
            buttonDisabled={false}
          />
        )}

        {/* Confirmed Orders */}
        {orderLines.confirmed.length > 0 && (
          <Box
            sx={{
              width: "fit-content",
              padding: 2,
              backgroundColor: "info.main",
            }}
          >
            <MyOrderList
              list={orderLines.confirmed}
              confirmOrder={confirmOrder}
              buttonDisabled={true}
            />
          </Box>
        )}
      </Box>
    </OrderLayout>
  );
}

// export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
//   context: GetServerSidePropsContext
// ) => {
//   const tableId = context.query.tableId as string;
//   // Fetch data based on the context (request parameters)
//   const data = await getOrdersByTableId(tableId);
//   return {
//     props: { data },
//   };
// };
