import OrderLayout from "@/components/OrderLayout";
import { Box, Button, IconButton, Snackbar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import OrderContext from "@/contexts/OrderContext";
import { Addon, AddonCategory, OrderLineType, OrderMenu } from "@/typing/types";
import AccordionComponent from "@/components/AccordionComponent";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";

const initialMenuItem: OrderMenu = {
  addonCategoryArr: [],
  id: 0,
  menuCategoryArr: [],
  name: "",
  price: 0,
};

export default function Menu() {
  const { app, setOrderLines, orderLines, getMenusByLocationId } =
    useContext(OrderContext);
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<OrderMenu>(initialMenuItem);
  const [qty, setQty] = useState(1);
  const [formData, setFormData] = useState<any>({});

  const [open, setOpen] = React.useState(false);

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
    if (!app.location.id) {
      const locationId = localStorage.getItem("OrderlocationId");
      getMenusByLocationId(Number(locationId));
    }
  }, []);

  useEffect(() => {
    if (typeof router.query.id === "string" && app.location.id) {
      setMenuItem(filteredMenuItem(router.query.id));
    }
    if (hasOrderLineId) {
      const prevOrder = orderLines[orderlineId];
      const addonData = orderLines[orderlineId]?.formData;
      setFormData(addonData);
      setQty(prevOrder.qty);
    }
  }, [router.query.id, app.location.id, router.query]);

  // useEffect(() => {
  //   console.log(orderLines);
  // }, [orderLines.length]);

  function filteredMenuItem(id: string): OrderMenu {
    return app.menus.filter((item) => item.id === Number(id))[0];
  }

  const filteredAddonCat = (): {
    requiredCat: AddonCategory[];
    optionalCat: AddonCategory[];
  } => {
    let requiredCat, optionalCat;

    const totalCat = app.addonCategories.filter((item) =>
      menuItem.addonCategoryArr.find((el) => el.id === item.id)
    );
    requiredCat = totalCat.filter((item) => item.is_required);
    optionalCat = totalCat.filter((item) => !item.is_required);
    return {
      requiredCat,
      optionalCat,
    };
  };

  const filteredAddons = (addonCatId: number): Addon[] => {
    return app.addons.filter((item) => item.addon_categories_id === addonCatId);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataAddonCat = Object.keys(formData);
    const requiredAddonCat = filteredAddonCat().requiredCat;
    const isValid = requiredAddonCat.every((item) =>
      formDataAddonCat.includes(item.name)
    );
    const totalAddons = Object.values(formData) as string[];
    const totalAddonPrice: number[] = totalAddons.map(
      (item) => app.addons.find((addon) => addon.name === item)?.price as number
    );
    const totalPriceForOne = [...totalAddonPrice, menuItem.price].reduce(
      (acc, curr) => acc + curr,
      0
    );

    const totalPrice = totalPriceForOne * qty;
    if (isValid) {
      const order: OrderLineType = {
        name: menuItem.name,
        price: totalPrice,
        qty,
        addons: totalAddons,
        formData,
        id: 0,
        orderStatus: "PENDING",
        isConfirm: false,
      };

      if (hasOrderLineId) {
        //editing orderline element
        const preOrderLines = JSON.parse(JSON.stringify(orderLines));
        preOrderLines[orderlineId] = order;
        setOrderLines(preOrderLines);
        localStorage.setItem("orderlists", JSON.stringify(preOrderLines));
      } else {
        //adding new element to orderline
        setOrderLines((pre) => {
          const newOrder = [...pre, order];
          localStorage.setItem("orderlists", JSON.stringify(newOrder));
          return newOrder;
        });
      }

      //reseting states to initial state
      setFormData({});
      setQty(1);
      openSnackBar();
    }
    return;
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
      {!menuItem?.id ? (
        <Box
          sx={{
            marginTop: "5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                {menuItem.name}
              </Typography>
              <Typography color="secondary">{menuItem.price} MMK</Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              {filteredAddonCat().requiredCat.map((item) => {
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
                      {filteredAddons(item.id).map((addon) => {
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
                              {addon.price === 0
                                ? "Free"
                                : addon.price + " MMK"}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </AccordionComponent>
                );
              })}
              {filteredAddonCat().optionalCat.map((item) => {
                return (
                  <AccordionComponent
                    name={item.name + "(optional)"}
                    key={item.id}
                  >
                    {filteredAddons(item.id).map((addon) => {
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
                <Button variant="contained" size="small" type="submit">
                  {hasOrderLineId ? "Edit Order" : "Add to Cart"}
                </Button>
              </Box>
            </form>
          </Box>
        </>
      )}
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
