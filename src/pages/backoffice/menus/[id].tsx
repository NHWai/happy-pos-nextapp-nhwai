import BackofficeLayout from "@/components/BackofficeLayout";
import BackOfficeContext from "@/contexts/BackofficeContext";
import {
  Typography,
  Box,
  Stack,
  IconButton,
  Autocomplete,
  Button,
  Chip,
  Snackbar,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import ModalBox from "@/components/ModalBox";
import { Location, MenuCategory, Menu } from "@/typing/types";
import { config } from "@/config/config";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmationBox from "@/components/ConfirmationBox";
import CloseIcon from "@mui/icons-material/Close";

const MenuItem = () => {
  const { company, app, setApp } = useContext(BackOfficeContext);
  const router = useRouter();
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>(
    []
  );
  const [selectedMenuCategories, setSelectedMenuCategories] = React.useState<
    string[]
  >([]);
  const [selectedAddonCategories, setSelectedAddonCategories] = React.useState<
    string[]
  >([]);
  const [menuItem, setMenuItem] = useState<Menu>({
    id: 0,
    locationArr: [],
    menuCategoryArr: [],
    addonCategoryArr: [],
    name: "",
    price: 0,
  });
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);

  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  useEffect(() => {
    if (app.error) {
      alert(app.error);
      setApp((pre) => ({ ...pre, status: "idle", error: "" }));
    }
  }, [app.error]);

  useEffect(() => {
    if (router.query.id && app.menus.length > 0) {
      const currItem = app.menus
        .filter((menu) => menu.id === Number(router.query.id))
        .pop();
      if (currItem) {
        setMenuItem(currItem);
      }
    }
  }, [router.query.id, app]);

  const filteredNames = (
    currArr: { id: number; is_available?: boolean }[],
    originArr: MenuCategory[] | Location[]
  ): string[] => {
    return currArr
      .map((el) => originArr.find((item) => item.id === el.id))
      .map((item) => item?.name as string)
      .filter((item, idx, arr) => arr.indexOf(item) === idx);
  };

  const filteredAvailableLocations = (
    currArr: { id: number; is_available: boolean }[],
    originArr: Location[]
  ): string[] => {
    const returnArr = currArr
      .map((el) =>
        originArr.find((item) => item.id === el.id && el.is_available)
      )
      .map((item) => item?.name as string)
      .filter((item, idx, arr) => arr.indexOf(item) === idx && item);

    return returnArr;
  };

  const updateMenu = async (formData: FormData) => {
    try {
      const response = await fetch(`${config.baseurl}/backoffice/menus/edit`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();

        setApp((pre) => ({
          ...pre,
          menus: pre.menus.map((el) => (el.id === data.id ? data : el)),
          error: "",
          status: "idle",
        }));
        setOpen(false);
        setSelectedLocations([]);
        setSelectedMenuCategories([]);
      } else {
        throw new Error("Failed to create a new menu-category");
      }
    } catch (error) {
      setApp((pre) => ({
        ...pre,
        error: error as string,
        status: "failed",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const isInvalidInput =
      !selectedLocations.length ||
      !selectedMenuCategories.length ||
      !formData.get("name") ||
      !/^[0-9]+$/.test(String(formData.get("price")));

    if (isInvalidInput) {
      setOpenSnackBar(true);
      return;
    }

    const editedLocationObjArr = selectedLocations
      .map((el) => app.locations.find((loc) => loc.name === el))
      .filter((item): item is Location => item !== undefined)
      .map((el) => ({
        is_available: !!formData.get(el.name),
        id: el.id,
        name: el.name,
      }));

    const editedMenuCategoriesObjArr = selectedMenuCategories
      .map((el) => app.menuCategories.find((cat) => cat.name === el))
      .map((el) => ({ id: el?.id, name: el?.name }));

    const editedMenuMenuCategoryLocation = editedMenuCategoriesObjArr
      .map((el) =>
        editedLocationObjArr.map((item) => ({
          menus_id: menuItem.id,
          menu_categories_id: el.id,
          locations_id: item.id,
          is_available: item.is_available,
        }))
      )
      .flat()
      .map((item) => JSON.stringify(item));

    const originalMenuMenuCategoryLocation = menuItem.menuCategoryArr
      .map((el) =>
        menuItem.locationArr.map((item) => ({
          menus_id: menuItem.id,
          menu_categories_id: el.id,
          locations_id: item.id,
          is_available: item.is_available,
        }))
      )
      .flat()
      .map((item) => JSON.stringify(item));

    const removeItems = originalMenuMenuCategoryLocation
      .filter((item) => !editedMenuMenuCategoryLocation.includes(item))
      .map((item) => JSON.parse(item));

    const addItems = editedMenuMenuCategoryLocation
      .filter((item) => !originalMenuMenuCategoryLocation.includes(item))
      .map((item) => JSON.parse(item));

    const addonCategoryIds = app.addonCategories
      .filter((item) => selectedAddonCategories.find((el) => el === item.name))
      .map((item) => item.id);

    // formData.append("sameItems", JSON.stringify(sameItems));
    formData.append("removeItems", JSON.stringify(removeItems));
    formData.append("addItems", JSON.stringify(addItems));
    formData.append("companyId", String(company.id));
    formData.append("menuId", String(menuItem.id));
    formData.append("addonCategoryIds", JSON.stringify(addonCategoryIds));

    // for (var [key, value] of formData.entries()) {
    //   console.log(key, "-->", value);
    // }

    setApp((pre) => ({
      ...pre,
      error: "",
      status: "loading",
    }));
    updateMenu(formData);
  };

  const handleDelete = async (id: number) => {
    setApp((pre) => ({ ...pre, status: "loading" }));
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/menus/delete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setApp((pre) => ({
          ...pre,
          menus: pre.menus.filter((menu) => menu.id !== id),
          status: "idle",
        }));
        // setOpenConfirmation(false);
        router.push("/backoffice/menus");
      } else {
        throw new Error("Failed to delete current menu ");
      }
    } catch (error) {
      setApp((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
    }
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setOpenSnackBar(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <BackofficeLayout>
      {app.status === "loading" ? (
        <Box
          sx={{
            display: "flex",
            mt: "30vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : app.status === "idle" && app.menus.length > 0 && menuItem.id ? (
        <>
          {" "}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "70%",
            }}
          >
            <Box
              sx={{ textDecoration: "none" }}
              component={Link}
              href="/backoffice/menus"
            >
              Go Back
            </Box>
            <Stack direction={"row"}>
              <IconButton
                onClick={() => {
                  setOpen(true);
                  setSelectedMenuCategories(
                    filteredNames(menuItem.menuCategoryArr, app.menuCategories)
                  );
                  setSelectedLocations(
                    filteredNames(menuItem.locationArr, app.locations)
                  );
                  setSelectedAddonCategories(
                    filteredNames(
                      menuItem.addonCategoryArr,
                      app.addonCategories
                    )
                  );
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => setOpenConfirmation(true)}>
                <DeleteIcon />
              </IconButton>{" "}
            </Stack>
          </Box>
          <Box sx={{ mt: 2, maxWidth: 350 }}>
            <Typography align="center" variant="h3">
              {menuItem.name}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
              <img width={200} height={150} src={menuItem.asset_url} />
            </Box>
            <Stack flexDirection={"row"} alignItems="baseline">
              <Typography textAlign={"end"} width={140} variant="body1">
                Price:
              </Typography>
              <Typography width={200} fontStyle={"italic"} fontWeight={"bold"}>
                {menuItem.price}MMK
              </Typography>
            </Stack>
            <Stack flexDirection={"row"} alignItems="baseline">
              <Typography textAlign={"end"} width={140} variant="body1">
                Menu Categories:
              </Typography>
              <Typography width={200} fontStyle={"italic"} fontWeight={"bold"}>
                {filteredNames(
                  menuItem.menuCategoryArr,
                  app.menuCategories
                ).join(", ")}
              </Typography>
            </Stack>
            <Stack flexDirection={"row"} alignItems="baseline">
              <Typography textAlign={"end"} width={140} variant="body1">
                Addon Categories:
              </Typography>
              <Typography width={200} fontStyle={"italic"} fontWeight={"bold"}>
                {filteredNames(
                  menuItem.addonCategoryArr,
                  app.addonCategories
                ).join(", ")}
              </Typography>
            </Stack>
            <Stack flexDirection={"row"} alignItems="baseline">
              <Typography textAlign={"end"} width={140} variant="body1">
                All Locations :
              </Typography>
              <Typography width={200} fontStyle={"italic"} fontWeight={"bold"}>
                {filteredNames(menuItem.locationArr, app.locations).join(", ")}
              </Typography>
            </Stack>
            <Stack flexDirection={"row"} alignItems="baseline">
              <Typography textAlign={"end"} width={140} variant="body1">
                Ava Locations :
              </Typography>
              <Typography width={200} fontStyle={"italic"} fontWeight={"bold"}>
                {filteredAvailableLocations(
                  menuItem.locationArr,
                  app.locations
                ).join(", ")}
              </Typography>
            </Stack>
          </Box>
          <ModalBox setOpen={setOpen} open={open} heading="Edit Menu">
            <Box
              onSubmit={handleSubmit}
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
              }}
              encType="multipart/form-data"
            >
              <TextField
                defaultValue={menuItem.name}
                variant="standard"
                label="name"
                name="name"
                autoComplete="off"
                required
              />
              <TextField
                defaultValue={menuItem.price}
                variant="standard"
                label="price"
                name="price"
                autoComplete="off"
                required
                type="number"
              />

              <input
                style={{
                  maxWidth: "180px",
                }}
                name="menuImg"
                type="file"
                accept="image/png, image/jpeg"
              />

              <Autocomplete
                multiple
                size="small"
                options={app.menuCategories?.map((item) => item.name)}
                disablePortal
                value={selectedMenuCategories}
                onChange={(event: any, newValue: string[]) =>
                  setSelectedMenuCategories(newValue)
                }
                sx={{ width: 200 }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Choose Menu Categories" />
                )}
              />

              <Autocomplete
                multiple
                size="small"
                options={app.addonCategories?.map((item) => item.name)}
                disablePortal
                value={selectedAddonCategories}
                onChange={(event: any, newValue: string[]) =>
                  setSelectedAddonCategories(newValue)
                }
                sx={{ width: 200 }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Choose Addon Categories" />
                )}
              />

              <Autocomplete
                multiple
                freeSolo
                size="small"
                options={app.locations?.map((item) => item.name)}
                disablePortal
                value={selectedLocations}
                onChange={(event: any, newValue: string[]) =>
                  setSelectedLocations(newValue)
                }
                sx={{ width: 200 }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Choose Locations" />
                )}
              />

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <span>Item is availiable in :</span>
                {selectedLocations.map((el, idx) => (
                  <label key={idx}>
                    <input
                      defaultChecked={
                        menuItem.locationArr[idx]
                          ? menuItem.locationArr[idx].is_available
                          : true
                      }
                      name={el}
                      type="checkbox"
                    />
                    {el}
                  </label>
                ))}
              </Box>

              <Button
                // disabled={menus.status === "loading"}
                variant="contained"
                type="submit"
                sx={{ alignSelf: "end" }}
              >
                Submit
              </Button>
            </Box>
          </ModalBox>{" "}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            mt: "30vh",
          }}
        >
          No menu item for given id
        </Box>
      )}
      <ConfirmationBox
        handleDelete={() => handleDelete(menuItem.id)}
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        heading="Are you sure to delete this menu?"
      />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
        message="Please fill up valid input values"
        action={action}
      />
    </BackofficeLayout>
  );
};

export default MenuItem;
