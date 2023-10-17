import { OrderLineType } from "@/typing/types";
import { Box, Button, Typography } from "@mui/material";
import React, { useContext } from "react";
import OrderCard from "./OrderCard";
import { useRouter } from "next/router";
import OrderContext from "@/contexts/OrderContext";

interface Props {
  list: OrderLineType[];
  confirmOrder?: () => {};
  buttonDisabled: boolean;
}

const MyOrderList = ({ list, confirmOrder, buttonDisabled }: Props) => {
  const { orderLines, setOrderLines } = useContext(OrderContext);
  const router = useRouter();

  const handleDelete = (idx: number) => {
    const newUnconfirmedOrderLines = [...orderLines.unconfirmed];
    newUnconfirmedOrderLines.splice(idx, 1);
    const updatedOrderLines = {
      ...orderLines,
      unconfirmed: newUnconfirmedOrderLines,
    };
    setOrderLines(updatedOrderLines);
    localStorage.setItem("orderlists", JSON.stringify(updatedOrderLines));
  };
  const handleEdit = (idx: number) => {
    const menuItemId = orderLines.unconfirmed[idx].menu.id;
    router.push(`/order/menus/${menuItemId}?orderlineidx=${idx}`);
  };
  return (
    <>
      {list.map((item, idx) => {
        return (
          <OrderCard
            key={idx}
            handleDelete={() => handleDelete(idx)}
            handleEdit={() => handleEdit(idx)}
            buttonDisabled={buttonDisabled}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" fontWeight={"1rem"}>
                {item.menu.name}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={"1rem"}
                fontStyle={"italic"}
              >
                {item.menu.price} MMK
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
                        <Typography variant="body2">{addon.name}</Typography>
                        <Typography
                          variant="body2"
                          fontWeight={"1rem"}
                          fontStyle={"italic"}
                        >
                          {addon.price} MMK
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
      <Button disabled={buttonDisabled} onClick={confirmOrder}>
        Confirm
      </Button>
    </>
  );
};

export default MyOrderList;
