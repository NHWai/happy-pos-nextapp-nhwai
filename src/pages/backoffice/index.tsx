import React, { useState } from "react";
import BackofficeLayout from "@/components/BackofficeLayout";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { config } from "@/config/config";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { OrderStatus } from "@prisma/client";
import { BackOfficeOrderlines } from "@/typing/types";
import { Autocomplete, Button, TextField } from "@mui/material";
import ModalBox from "@/components/ModalBox";
import Divider from "@mui/material/Divider";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

interface Props {
  orders_id: number;
  tables_id: number;
  is_paid: boolean;
  order_status: OrderStatus;
  price: number | null;
  menu: string;
  addons: string[];
  quantity: number;
}

function Row(props: Props) {
  const {
    orders_id,
    tables_id,
    is_paid,
    order_status,
    price,
    menu,
    addons,
    quantity,
  } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {orders_id}
        </TableCell>
        <TableCell>{tables_id}</TableCell>
        <TableCell>{is_paid ? "True" : "False"}</TableCell>
        <TableCell>{order_status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box>
                <Typography variant="h6" gutterBottom component="div">
                  Order Details
                </Typography>
                <Typography variant="body2">Menu:{menu}</Typography>
                <Typography variant="body2">
                  Addons:{addons.join(",")}
                </Typography>
                <Typography variant="body2">Qty:{quantity} nos</Typography>
                <Typography variant="body2">Price:{price} MMK</Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Home() {
  const {
    selectedLocation,
    backofficeOrderlines,
    setBackofficeOrderlines,
    getOrders,
    app,
  } = React.useContext(BackOfficeContext);

  React.useEffect(() => {
    !backofficeOrderlines.items.length && getOrders();
  }, []);

  React.useEffect(() => {
    if (backofficeOrderlines.error) {
      alert(backofficeOrderlines.error);
    }
  }, [backofficeOrderlines.error]);

  const [openOrderStatus, setOpenOrderStatus] = React.useState<boolean>(false);
  const [orderIdArr, setOrderIdArr] = React.useState<number[]>([]);
  const [orderStatusVal, setOrderStatusVal] = React.useState<string>("");
  const [openIsPaid, setOpenIsPaid] = React.useState(false);
  const [paid, setPaid] = React.useState<string>("");
  const [openTableId, setOpenTableId] = React.useState(false);
  const [openOrderId, setOpenOrderId] = React.useState(false);

  const [filter, setFilter] = React.useState<{
    orders_id: null | number;
    tables_id: null | number;
    is_paid: null | string;
    order_status: null | OrderStatus;
    locations_id: number;
  }>({
    orders_id: null,
    tables_id: null,
    is_paid: null,
    order_status: null,
    locations_id: selectedLocation.id,
  });

  const handleClick = (name: string) => {
    if (name === "orderStatus" && orderStatusVal) {
      //check order status
      const filteredOrderIds = orderIdArr.filter(
        (orderId) =>
          backofficeOrderlines.items.find(
            (item) =>
              item.orders_id === orderId && item.order_status !== orderStatusVal
          ) && orderId
      );

      //check is valid
      const isValid = orderIdArr.length > 0 && filteredOrderIds.length > 0;
      // change order status
      if (isValid) {
        updateOrderlines(filteredOrderIds, orderStatusVal as OrderStatus);
        setOpenOrderStatus(false);
      }
    }

    if (name === "isPaid" && (paid === "true" || paid === "false")) {
      // check is paid
      const filteredOrderIds = orderIdArr.filter(
        (orderId) =>
          backofficeOrderlines.items.find(
            (item) => paid !== String(item.is_paid)
          ) && orderId
      );

      //check is valid
      const isValid = orderIdArr.length > 0 && filteredOrderIds.length > 0;
      // change order status
      if (isValid) {
        const paidBool = paid === "true";
        updateOrderlines(filteredOrderIds, undefined, paidBool);
        setOpenIsPaid(false);
      }
    }
  };

  function chgMenuIdToName(menuId: number): string {
    return app.menus.find((menu) => menu.id === menuId)?.name as string;
  }

  function chgAddonsIdToName(addonId: number[]): string[] {
    return addonId.map(
      (addon) => app.addons.find((item) => item.id === addon)?.name as string
    );
  }

  async function updateOrderlines(
    orderId: number[],
    order_status?: OrderStatus,
    is_paid?: boolean
  ) {
    setBackofficeOrderlines((pre) => ({ ...pre, status: "loading" }));

    const responseBody = {
      orderId,
      order_status,
      is_paid,
    };

    try {
      const response = await fetch(`${config.baseurl}/backoffice/orders/edit`, {
        method: "PUT",
        body: JSON.stringify(responseBody),
      });
      if (response.ok) {
        if (order_status !== undefined) {
          setBackofficeOrderlines((pre) => ({
            items: pre.items.map((item) =>
              orderId.includes(item.orders_id)
                ? { ...item, order_status: order_status }
                : item
            ),
            status: "idle",
            error: "",
          }));
        }

        if (is_paid !== undefined) {
          setBackofficeOrderlines((pre) => ({
            items: pre.items.map((item) =>
              orderId.includes(item.orders_id)
                ? { ...item, is_paid: is_paid }
                : item
            ),
            status: "idle",
            error: "",
          }));
        }
      } else {
        throw new Error("Failed to change orderstatus");
      }
    } catch (error) {
      setBackofficeOrderlines((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
    }
  }

  function filteredOrders(): BackOfficeOrderlines[] {
    return backofficeOrderlines.items.filter((item) => {
      if (filter.locations_id && filter.locations_id !== item.locations_id) {
        return false;
      }

      if (filter.is_paid !== null && filter.is_paid !== String(item.is_paid)) {
        return false;
      }

      if (
        filter.order_status !== null &&
        filter.order_status !== item.order_status
      ) {
        return false;
      }

      if (filter.tables_id !== null && filter.tables_id !== item.tables_id) {
        return false;
      }

      if (filter.orders_id !== null && filter.orders_id !== item.orders_id) {
        return false;
      }

      return true;
    });
  }

  const currOrderlines = filteredOrders();
  const totalAmount = currOrderlines
    .filter((item) => !item.is_paid)
    .map((item) => item.price as number)
    .reduce((preVal: number, currVal: number) => preVal + currVal, 0);
  return (
    <BackofficeLayout>
      <Typography variant="h4" marginTop={"1rem"}>
        Orders
      </Typography>
      {selectedLocation.id ? (
        <Typography
          alignSelf={"left"}
          variant="caption"
          fontStyle={"italic"}
          fontWeight={"bold"}
          paddingBottom={"1rem"}
        >
          Location : {selectedLocation.name}
        </Typography>
      ) : (
        ""
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          marginTop: "1rem",
        }}
      >
        <Typography sx={{ paddingRight: "0.5rem" }}>Total :</Typography>
        <Typography fontStyle={"italic"} fontWeight={"bold"}>
          {totalAmount} MMK
        </Typography>
      </Box>
      <TableContainer
        sx={{ marginY: "1rem", maxHeight: 440 }}
        component={Paper}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Button
                  onClick={() => {
                    getOrders();
                  }}
                  variant="outlined"
                  size="small"
                >
                  <small>Refresh</small>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  startIcon={
                    filter.orders_id ? <FilterAltIcon /> : <FilterAltOffIcon />
                  }
                  onClick={() => {
                    setOpenOrderId(true);
                  }}
                  variant="outlined"
                  size="small"
                >
                  <small>Orders_Id</small>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  startIcon={
                    filter.tables_id ? <FilterAltIcon /> : <FilterAltOffIcon />
                  }
                  onClick={() => {
                    setOpenTableId(true);
                  }}
                  variant="outlined"
                  size="small"
                >
                  <small>Tables_Id</small>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  startIcon={
                    filter.is_paid ? <FilterAltIcon /> : <FilterAltOffIcon />
                  }
                  onClick={() => {
                    setOpenIsPaid(true);
                    setOrderIdArr([]);
                    setPaid("");
                  }}
                  variant="outlined"
                  size="small"
                >
                  <small>Is Paid</small>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  startIcon={
                    filter.order_status ? (
                      <FilterAltIcon />
                    ) : (
                      <FilterAltOffIcon />
                    )
                  }
                  onClick={() => {
                    setOpenOrderStatus(true);
                    setOrderIdArr([]);
                    setOrderStatusVal("");
                  }}
                  variant="outlined"
                  size="small"
                >
                  <small>Order Status</small>
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currOrderlines.map((orderline) => (
              <Row
                key={orderline.orders_id}
                orders_id={orderline.orders_id}
                is_paid={orderline.is_paid}
                order_status={orderline.order_status}
                tables_id={orderline.tables_id}
                price={orderline.price}
                menu={chgMenuIdToName(orderline.menus_id)}
                addons={chgAddonsIdToName(orderline.addons_id)}
                quantity={orderline.quantity}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!currOrderlines.length && (
        <Typography
          sx={{ fontStyle: "italic" }}
          textAlign={"center"}
          variant="body1"
        >
          No orders
        </Typography>
      )}
      <ModalBox
        open={openOrderStatus}
        setOpen={setOpenOrderStatus}
        heading="Set Order Status"
      >
        <Autocomplete
          value={filter.order_status}
          onChange={(event: any, newValue: OrderStatus | null) => {
            setFilter((pre) => ({ ...pre, order_status: newValue }));
          }}
          options={Object.values(OrderStatus)}
          isOptionEqualToValue={(option, value) =>
            typeof option === typeof value
          }
          sx={{ minWidth: "240px", maxWidth: "300px", marginBottom: "1rem" }}
          renderInput={(params) => (
            <TextField {...params} label="Filter Order Status" />
          )}
        />
        <Box sx={{ marginBottom: "1rem", border: "1px solid black" }}>
          <Divider />
        </Box>
        <Autocomplete
          multiple
          value={orderIdArr}
          disableCloseOnSelect
          onChange={(event: any, newValue: number[]) => {
            setOrderIdArr(newValue);
          }}
          options={currOrderlines.map((item) => item.orders_id)}
          getOptionLabel={(option: number) => String(option)}
          sx={{ minWidth: "240px", maxWidth: "300px", marginBottom: "1rem" }}
          renderInput={(params) => (
            <TextField {...params} label="Choose OrderId" />
          )}
        />
        <Autocomplete
          value={orderStatusVal}
          onChange={(event: any, newValue: string | null) => {
            if (newValue) {
              setOrderStatusVal(newValue);
            }
          }}
          options={Object.values(OrderStatus)}
          isOptionEqualToValue={(option, value) =>
            typeof option === typeof value
          }
          sx={{ minWidth: "240px", maxWidth: "300px", marginBottom: "1rem" }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Order Status" />
          )}
        />
        <Button
          sx={{ width: "fit-content", marginX: "auto" }}
          type="submit"
          disabled={backofficeOrderlines.status === "loading"}
          onClick={() => handleClick("orderStatus")}
          variant="outlined"
        >
          Submit
        </Button>
      </ModalBox>
      <ModalBox heading="Set is Paid" open={openIsPaid} setOpen={setOpenIsPaid}>
        <Autocomplete
          value={filter.is_paid}
          onChange={(event: any, newValue: string | null) => {
            setFilter((pre) => ({ ...pre, is_paid: newValue }));
          }}
          options={["true", "false"]}
          isOptionEqualToValue={(option, value) =>
            typeof option === typeof value
          }
          renderInput={(params) => (
            <TextField {...params} label="Filter Is Paid" />
          )}
          sx={{ marginBottom: "1rem" }}
        />
        <Box sx={{ marginBottom: "1rem", border: "1px solid black" }}>
          <Divider />
        </Box>
        <Autocomplete
          multiple
          value={orderIdArr}
          disableCloseOnSelect
          onChange={(event: any, newValue: number[]) => {
            setOrderIdArr(newValue);
          }}
          options={currOrderlines.map((item) => item.orders_id)}
          getOptionLabel={(option: number) => String(option)}
          sx={{ minWidth: "240px", maxWidth: "300px", marginBottom: "1rem" }}
          renderInput={(params) => (
            <TextField {...params} label="Choose OrderId" />
          )}
        />
        <Autocomplete
          value={paid}
          onChange={(event: any, newValue: string | null) => {
            typeof newValue === "string" && setPaid(newValue);
          }}
          options={["true", "false"]}
          isOptionEqualToValue={(option, value) =>
            typeof option === typeof value
          }
          renderInput={(params) => (
            <TextField {...params} label="Choose Is Paid" />
          )}
          sx={{ marginBottom: "1rem" }}
        />
        <Button
          sx={{ width: "fit-content", marginX: "auto" }}
          type="submit"
          disabled={backofficeOrderlines.status === "loading"}
          onClick={() => handleClick("isPaid")}
          variant="outlined"
        >
          Submit
        </Button>
      </ModalBox>
      <ModalBox
        heading="Filter TableId"
        open={openTableId}
        setOpen={setOpenTableId}
      >
        <Autocomplete
          value={filter.tables_id}
          onChange={(event: any, newValue: number | null) => {
            setFilter((pre) => ({ ...pre, tables_id: newValue }));
          }}
          options={currOrderlines
            .map((item) => item.tables_id)
            .filter((item, idx, arr) => arr.indexOf(item) === idx)}
          getOptionLabel={(option: number) => String(option)}
          renderInput={(params) => (
            <TextField {...params} label="Filter TableId" />
          )}
          sx={{ marginBottom: "1rem" }}
        />
      </ModalBox>
      <ModalBox
        heading="Filter OrderId"
        open={openOrderId}
        setOpen={setOpenOrderId}
      >
        <Autocomplete
          value={filter.orders_id}
          onChange={(event: any, newValue: number | null) => {
            setFilter((pre) => ({ ...pre, orders_id: newValue }));
          }}
          options={currOrderlines.map((item) => item.orders_id)}
          getOptionLabel={(option: number) => String(option)}
          renderInput={(params) => (
            <TextField {...params} label="Filter OrderId" />
          )}
          sx={{ marginBottom: "1rem" }}
        />
      </ModalBox>
    </BackofficeLayout>
  );
}
