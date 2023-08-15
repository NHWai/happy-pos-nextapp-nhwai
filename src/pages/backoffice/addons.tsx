import BackofficeLayout from "@/components/BackofficeLayout";
import ConfirmationBox from "@/components/ConfirmationBox";
import ModalBox from "@/components/ModalBox";
import { config } from "@/config/config";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { Addon } from "@/typing/types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const initialAddon = {
  id: 0,
  name: "",
  price: 0,
  is_available: true,
  addonCategory: "",
  companies_id: 0,
};

const Addons = () => {
  const { company, app, setApp, selectedLocation } =
    React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const [currAddon, setCurrAddon] = useState(initialAddon);

  React.useEffect(() => {
    if (app.error) {
      alert(app.error);
      setApp((pre) => ({ ...pre, status: "idle", error: "" }));
    }
  }, [app.error]);

  const createAddonCategory = async () => {
    const body = {
      name: currAddon.name,
      is_available: currAddon.is_available,
      price: Number(currAddon.price),
      addon_categories_id: chgAddonCategoryNameToId(currAddon.addonCategory),
      companies_id: company.id,
    };

    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/addons/create`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setApp((pre) => ({
          ...pre,
          addons: [...pre.addons, data],
          status: "idle",
          error: "",
        }));
        setCurrAddon(initialAddon);
        setOpen(false);
      } else {
        throw new Error("Failed to create a new addon");
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
      name: currAddon.name,
      is_available: currAddon.is_available,
      price: Number(currAddon.price),
      addon_categories_id: chgAddonCategoryNameToId(currAddon.addonCategory),
      companies_id: company.id,
      id: currAddon.id,
    };
    try {
      const response = await fetch(`${config.baseurl}/backoffice/addons/edit`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const data = await response.json();
        setApp((pre) => ({
          ...pre,
          addons: pre.addons.map((item) =>
            item.id === currAddon.id ? data : item
          ),
          status: "idle",
          error: "",
        }));
        setCurrAddon(initialAddon);
        setOpen(false);
      } else {
        throw new Error("Failed to update the addon");
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
    const isInputFieldsValid =
      !currAddon.addonCategory ||
      !currAddon.name ||
      !/^[0-9]+$/.test(String(currAddon.price));

    if (isInputFieldsValid) {
      setOpenSnackBar(true);
      return;
    }

    setApp((pre) => ({ ...pre, status: "loading" }));
    if (!currAddon.id) {
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
        `${config.baseurl}/backoffice/addons/delete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setApp((pre) => ({
          ...pre,
          addons: pre.addons.filter((menuCategory) => menuCategory.id !== id),
          status: "idle",
        }));
        setCurrAddon(initialAddon);
        setOpen(false);
        setOpenConfirmation(false);
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

  const chgAddonCategoryNameToId = (addonCat: string): number => {
    return app.addonCategories.filter((item) => item.name === addonCat)[0].id;
  };

  const chgAddonCategoryIdtoName = (addonCatId: number): string => {
    return app.addonCategories.filter((item) => item.id === addonCatId)[0].name;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrAddon((pre) => ({
      ...pre,
      [e.target.name]:
        e.target.name === "is_available" ? e.target.checked : e.target.value,
    }));
  };

  const filteredAddons = (locationId: number): Addon[] => {
    const filteredMenus = app.menus
      .filter((item) => item.locationArr.find((loc) => loc.id === locationId))
      .map((item) => item.addonCategoryArr)
      .flat()
      .map((item) => item.id)
      .filter((item, idx, arr) => arr.indexOf(item) === idx);

    return filteredMenus
      .map((item) =>
        app.addons.filter((addon) => addon.addon_categories_id === item)
      )
      .flat();
  };

  const addonItems = selectedLocation.id
    ? filteredAddons(selectedLocation.id)
    : app.addons;

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
      <Typography mt={3} mb={2} variant="h4" color="secondary">
        Addons
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
        {!selectedLocation.id && (
          <IconButton
            onClick={() => {
              setOpen(true);
              setCurrAddon(initialAddon);
            }}
          >
            <AddCircleOutlineIcon color="primary" />
          </IconButton>
        )}
        {app.addons.length > 0 ? (
          <>
            {addonItems?.map((item) => (
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
                label={item.name}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpen(true);
                  setCurrAddon({
                    id: item.id,
                    name: item.name,
                    is_available: item.is_available,
                    addonCategory: chgAddonCategoryIdtoName(
                      item.addon_categories_id
                    ),
                    companies_id: item.companies_id,
                    price: item.price,
                  });
                }}
              />
            ))}
          </>
        ) : (
          <div>No Addons</div>
        )}
      </Stack>

      <ModalBox
        open={open}
        setOpen={setOpen}
        heading={`${!currAddon.id ? "Create" : "Edit"} Addon`}
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
            fullWidth
            variant="standard"
            label="name"
            value={currAddon.name}
            name="name"
            onChange={handleChange}
            color="secondary"
            autoComplete="off"
            required
            sx={{ input: { color: "secondary.main" } }}
          />
          <TextField
            variant="standard"
            label="price"
            type="number"
            value={currAddon.price}
            name="price"
            onChange={handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">MMK</InputAdornment>,
            }}
            sx={{ input: { color: "secondary.main" } }}
            autoComplete="off"
            required
          />

          <Autocomplete
            size="small"
            options={app.addonCategories.map((item) => item.name)}
            disablePortal
            value={currAddon.addonCategory}
            onChange={(event: any, newValue: string | null) =>
              typeof newValue === "string" &&
              setCurrAddon((pre) => ({
                ...pre,
                addonCategory: newValue,
              }))
            }
            isOptionEqualToValue={(option, value) =>
              typeof option === typeof value
            }
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Addon Categories"
                required
                sx={{ input: { color: "secondary.main" } }}
              />
            )}
          />

          {!selectedLocation.id && (
            <label>
              <input
                name="is_available"
                checked={currAddon.is_available}
                type="checkbox"
                onChange={handleChange}
              />
              <Typography variant="button" color="secondary">
                {" "}
                is_available
              </Typography>
            </label>
          )}
          {!currAddon.id ? (
            <Button
              disabled={app.status === "loading"}
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          ) : (
            !selectedLocation.id && (
              <Stack
                direction="row"
                justifyContent={"space-between"}
                width="100%"
              >
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    setOpenConfirmation(true);
                  }}
                >
                  Delete
                </Button>
                <Button
                  disabled={app.status === "loading"}
                  variant="outlined"
                  type="submit"
                >
                  Edit
                </Button>
              </Stack>
            )
          )}
        </Box>
      </ModalBox>
      <ConfirmationBox
        handleDelete={() => handleDelete(currAddon.id)}
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        heading="Are you sure to delete this because this might delete related addons_categories?"
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

export default Addons;
