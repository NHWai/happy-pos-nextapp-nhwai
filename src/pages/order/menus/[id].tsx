import OrderLayout from "@/components/OrderLayout";
import { Box, Button, IconButton, Snackbar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import OrderContext, { TotalOrderLineType } from "@/contexts/OrderContext";
import AccordionComponent from "@/components/AccordionComponent";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import {
  FetchOrderMenusByIdType,
  fetchOrderMenusById,
} from "@/config/orderDataFetching";
import { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import { OrderLineType } from "@/typing/types";

type ServerSideProps = {
  data: FetchOrderMenusByIdType;
};

export default function Menu({ data }: ServerSideProps) {
  const { setOrderLines, orderLines } = useContext(OrderContext);
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [formData, setFormData] = useState<any>({});

  const [open, setOpen] = React.useState(false);

  // useEffect(() => {
  //   console.log(orderLines);
  // }, [orderLines]);

  const openSnackBar = () => {
    setOpen(true);
  };

  const closeSnackBar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  //
  const orderlineId = Number(router.query.orderlineidx);
  const hasOrderLineId = !isNaN(orderlineId) && typeof orderlineId === "number";

  useEffect(() => {
    if (hasOrderLineId) {
      const prevOrder = orderLines.unconfirmed[orderlineId];
      const addonData = orderLines.unconfirmed[orderlineId]?.formData;
      setFormData(addonData);
      setQty(prevOrder.qty);
    }
  }, [router.query.id, router.query]);

  const requiredAddons = data.totalAddonCategories.required.map(
    (item) => item.addons
  );
  const optionalAddons = data.totalAddonCategories.optional.map(
    (item) => item.addons
  );
  const totalAddons = [...requiredAddons, ...optionalAddons].flat();

  const requiredAddonCategories = data.totalAddonCategories.required.map(
    (item) => item.name
  );

  const formDataAddonCategory = Object.keys(formData);
  const checkRequiredAddonCategory = requiredAddonCategories.every(
    (item) => formDataAddonCategory.indexOf(item) >= 0
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataAddons = Object.values(formData);

    let totalAddonPriceForOne = 0;
    totalAddons.forEach((addon) => {
      if (formDataAddons.some((item) => item === addon.name)) {
        totalAddonPriceForOne += addon.price;
      }
    });
    const priceForOneItem = totalAddonPriceForOne + data.menu.price;

    const totalPrice = priceForOneItem * qty;

    const order: OrderLineType = {
      menu: data.menu,
      qty,
      price: totalPrice,
      addons: totalAddons.filter((item) =>
        formDataAddons.some((el) => el === item.name)
      ),
      id: 0,
      formData,
      orderStatus: "PENDING",
      isConfirm: false,
    };

    if (hasOrderLineId) {
      //editing orderline element

      setOrderLines((pre) => {
        return {
          ...pre,
          unconfirmed: [
            ...pre.unconfirmed.slice(0, orderlineId),
            order,
            ...pre.unconfirmed.slice(orderlineId + 1),
          ],
        };
      });
    } else {
      //adding new element to orderline

      setOrderLines((pre) => {
        return {
          ...pre,
          unconfirmed: [...pre.unconfirmed, order],
        };
      });
    }
    //reseting states to initial state
    setFormData({});
    setQty(1);
    openSnackBar();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((pre: any) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClear = (itemname: string) => {
    const newFormData = JSON.parse(JSON.stringify(formData));
    delete newFormData[`${itemname}`];
    setFormData(newFormData);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <OrderLayout>
      <Button
        sx={{ alignSelf: "flex-start" }}
        onClick={() => router.back()}
        startIcon={<KeyboardBackspaceIcon />}
      >
        Go Back
      </Button>

      <Box
        sx={{
          width: "100%",
          maxWidth: "300px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h6" color="secondary">
            {data.menu.name}
          </Typography>
          <Typography color="secondary">{data.menu.price} MMK</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          {data.totalAddonCategories.required.map((item) => {
            return (
              <AccordionComponent
                name={item.name + "(required)"}
                key={item.id}
                isExpanded={true}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {item.addons.map((addon) => {
                    return (
                      <Box
                        key={addon.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <label>
                          <input
                            type="radio"
                            name={item.name}
                            value={addon.name}
                            checked={formData[item.name] === addon.name}
                            onChange={handleChange}
                          />
                          {" " + addon.name}
                        </label>
                        <Box>
                          {addon.price === 0 ? "Free" : addon.price + " MMK"}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </AccordionComponent>
            );
          })}
          {data.totalAddonCategories.optional.map((item) => {
            return (
              <AccordionComponent name={item.name + "(optional)"} key={item.id}>
                {item.addons.map((addon) => {
                  return (
                    <Box
                      key={addon.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <label>
                        <input
                          type="radio"
                          name={item.name}
                          value={addon.name}
                          onChange={handleChange}
                          checked={formData[item.name] === addon.name}
                        />
                        {" " + addon.name}
                      </label>
                      <Box>
                        {addon.price === 0 ? "Free" : addon.price + " MMK"}
                      </Box>
                    </Box>
                  );
                })}
                {item.name in formData && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ marginTop: "1rem" }}
                    onClick={() => handleClear(item.name)}
                  >
                    Clear
                  </Button>
                )}
              </AccordionComponent>
            );
          })}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginY: "1rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => setQty((pre) => (pre > 1 ? pre - 1 : pre))}
                color="primary"
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1">{qty}</Typography>
              <IconButton
                onClick={() => setQty((pre) => pre + 1)}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              size="small"
              type="submit"
              disabled={!checkRequiredAddonCategory}
            >
              {hasOrderLineId ? "Edit Order" : "Add to Cart"}
            </Button>
          </Box>
        </form>
      </Box>

      {/* <Button onClick={handleClick}>Open simple snackbar</Button> */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={closeSnackBar}
        message="Added to cart"
        action={action}
      />
    </OrderLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context: GetServerSidePropsContext
) => {
  try {
    const menuId = context.query.id as string;

    const data = await fetchOrderMenusById(menuId);
    return {
      props: { data },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      notFound: true, // Handle errors as not found or customize your error handling
    };
  }
};
