import { config } from "@/config/config";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import BackofficeLayout from "@/components/BackofficeLayout";
import ConfirmationBox from "@/components/ConfirmationBox";
import LetterBox from "@/components/LetterBox";
import ModalBox from "@/components/ModalBox";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { AddonCategory } from "@/typing/types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import CreateBtn from "@/components/CreateBtn";
import ButtonBox from "@/components/ButtonBox";

const initialAddonCategory = {
  id: 0,
  name: "",
  is_required: false,
};

const MenuCategories = () => {
  const { company, app, setApp, selectedLocation } =
    React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);

  const [currAddonCategory, setCurrAddonCategory] =
    useState(initialAddonCategory);

  const [openSnackBar, setOpenSnackBar] = useState(false);

  //to change menuCategoryArr to addonCategoryArr
  function showAddons(currId: number) {
    return app.addons
      .filter((item) => item.addon_categories_id === currId)
      .map((item) => item.name);
  }

  React.useEffect(() => {
    if (app.error) {
      alert(app.error);
      setApp((pre) => ({ ...pre, status: "idle", error: "" }));
    }
  }, [app.error]);

  const createAddonCategory = async () => {
    const body = {
      name: currAddonCategory.name,
      is_required: currAddonCategory.is_required,
      companyId: company.id,
    };
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/addon-categories/create`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setApp((pre) => ({
          ...pre,
          addonCategories: [...pre.addonCategories, data],
          status: "idle",
          error: "",
        }));
        setCurrAddonCategory(initialAddonCategory);
        setOpen(false);
      } else {
        throw new Error("Failed to create a new menu-category");
      }
    } catch (error) {
      setApp((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
    }
  };

  const updateAddonCategory = async () => {
    const body = {
      id: currAddonCategory.id,
      name: currAddonCategory.name,
      is_required: currAddonCategory.is_required,
      companyId: company.id,
    };
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/addon-categories/edit`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setApp((pre) => ({
          ...pre,
          addonCategories: pre.addonCategories.map((item) =>
            item.id === currAddonCategory.id ? data : item
          ),
          status: "idle",
          error: "",
        }));
        setCurrAddonCategory(initialAddonCategory);
        setOpen(false);
      } else {
        throw new Error("Failed to create a new menu-category");
      }
    } catch (error) {
      setApp((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidInput = !currAddonCategory.name;

    if (isValidInput) {
      setOpenSnackBar(true);
      return;
    }

    setApp((pre) => ({ ...pre, status: "loading" }));
    if (!currAddonCategory.id) {
      //creat newAddonCategories
      company.id && createAddonCategory();
    } else {
      updateAddonCategory();
    }
  };

  const handleDelete = async (id: number) => {
    setApp((pre) => ({ ...pre, status: "loading" }));
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/addon-categories/delete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setApp((pre) => ({
          ...pre,
          addonCategories: pre.addonCategories.filter(
            (menuCategory) => menuCategory.id !== id
          ),
          addons: pre.addons.filter(
            (addon) => addon.addon_categories_id !== id
          ),
          menus: pre.menus.map((menuItem) => ({
            ...menuItem,
            addonCategoryArr: menuItem.addonCategoryArr.filter(
              (item) => item.id !== id
            ),
          })),
          status: "idle",
        }));
        setCurrAddonCategory(initialAddonCategory);
        setOpenConfirmation(false);
        setOpen(false);
      } else {
        throw new Error(
          `Failed to delete current menu category \n Status Code: ${response.status}`
        );
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

  const filteredAddonCategories = (locationId: number): AddonCategory[] => {
    const filteredMenus = app.menus
      .filter((item) => item.locationArr.find((loc) => loc.id === locationId))
      .map((item) => item.addonCategoryArr)
      .flat()
      .map((item) => item.id)
      .filter((item, idx, arr) => arr.indexOf(item) === idx);

    return filteredMenus.map(
      (item) =>
        app.addonCategories.find(
          (addonCat) => addonCat.id === item
        ) as AddonCategory
    );
  };

  const addonCategoryItems = selectedLocation.id
    ? filteredAddonCategories(selectedLocation.id)
    : app.addonCategories;

  return (
    <BackofficeLayout>
      <Typography mt={3} mb={2} variant="h4" color="secondary">
        Addon Categories
      </Typography>
      {selectedLocation.id ? (
        <Typography
          alignSelf={"left"}
          variant="caption"
          fontStyle={"italic"}
          fontWeight={"bold"}
          paddingBottom={"1rem"}
          color="secondary"
        >
          Location : {selectedLocation.name}
        </Typography>
      ) : (
        ""
      )}
      <Stack
        sx={{
          maxWidth: "400px",
          mx: "auto",
          px: 3,
          flexWrap: "wrap",
        }}
        alignItems="center"
        direction="row"
        gap={1}
      >
        {!selectedLocation.name && (
          <IconButton
            onClick={() => {
              setOpen(true);
              setCurrAddonCategory(initialAddonCategory);
            }}
          >
            <AddCircleOutlineIcon color="primary" />
          </IconButton>
        )}
        {app.addonCategories.length > 0 ? (
          <>
            {addonCategoryItems?.map((item) => (
              <Chip
                key={item?.id}
                sx={{
                  cursor: "pointer",
                  color: "secondary.dark",
                  backgroundColor: "info.main",
                  height: "auto",
                  "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "pre-wrap",
                    padding: 1,
                  },
                }}
                label={
                  item.name + " \n (" + showAddons(item.id).length + " addon/s)"
                }
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpen(true);
                  setCurrAddonCategory({
                    id: item.id,
                    name: item.name,
                    is_required: item.is_required,
                  });
                }}
              />
            ))}
          </>
        ) : (
          <div>No Addon Categories</div>
        )}
      </Stack>

      <ModalBox
        open={open}
        setOpen={setOpen}
        heading={`${!currAddonCategory.id ? "Create" : "Edit"} Addon Category`}
      >
        <Box
          onSubmit={handleSubmit}
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            error={!!app.error}
            variant="standard"
            label="name"
            name="newMenuCategory"
            value={currAddonCategory.name}
            onChange={(e) =>
              setCurrAddonCategory((pre) => ({
                ...pre,
                name: e.target.value,
              }))
            }
            sx={{ input: { color: "secondary.main" } }}
            autoComplete="off"
            required
          />

          {!selectedLocation.id && (
            <label>
              <input
                name="is_required"
                checked={currAddonCategory.is_required}
                type="checkbox"
                onChange={(e) =>
                  setCurrAddonCategory((pre) => ({
                    ...pre,
                    is_required: e.target.checked,
                  }))
                }
              />{" "}
              <Typography variant="button" color="secondary">
                is_required
              </Typography>
            </label>
          )}
          <Box sx={{ marginLeft: "-5rem" }}>
            <LetterBox
              label="Addons"
              value={showAddons(currAddonCategory.id).join(", ")}
            />
          </Box>

          {!currAddonCategory.id ? (
            <CreateBtn createBtnDisabled={app.status === "loading"} />
          ) : (
            !selectedLocation.id && (
              <ButtonBox
                delBtnClick={() => setOpenConfirmation(true)}
                editBtnDisabled={app.status === "loading"}
              />
            )
          )}
        </Box>
      </ModalBox>
      <ConfirmationBox
        handleDelete={() => handleDelete(currAddonCategory.id)}
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        heading="Are you sure to delete this because this might delete related menus?"
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

export default MenuCategories;
