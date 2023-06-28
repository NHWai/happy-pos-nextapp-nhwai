import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { config } from "@/config/config";
import { RouteLayout } from "../../components/RouteLayout";
import PageLayout from "@/components/PageLayout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BackOfficeContext from "@/contexts/BackofficeContext";
import ModalBox from "@/components/ModalBox";
import ConfirmationBox from "@/components/ConfirmationBox";

const initialAddonCategory = {
  id: 0,
  name: "",
  is_required: false,
};

const MenuCategories = () => {
  const { company, app, setApp } = React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);

  const [currAddonCategory, setCurrAddonCategory] =
    useState(initialAddonCategory);

  //to change menuCategoryArr to addonCategoryArr
  function showMenus(currId: number) {
    return app.menus
      .filter((item) => item.menuCategoryArr.find((el) => el.id === currId))
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
          status: "idle",
        }));
        setCurrAddonCategory(initialAddonCategory);
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

  return (
    <PageLayout>
      <RouteLayout>
        <Typography mt={3} mb={2} variant="h4">
          Addon Categories
        </Typography>

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
          <IconButton
            onClick={() => {
              setOpen(true);
              setCurrAddonCategory(initialAddonCategory);
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
          {app.menuCategories?.length > 0 ? (
            <>
              {app.addonCategories?.map((item) => (
                <Chip
                  key={item?.id}
                  sx={{
                    height: "auto",
                    "& .MuiChip-label": {
                      display: "block",
                      whiteSpace: "pre-wrap",
                      padding: 1,
                    },
                  }}
                  label={
                    item.name + " \n (" + showMenus(item.id).length + " menu/s)"
                  }
                  style={{ cursor: "pointer" }}
                  onDelete={() => {
                    setOpenConfirmation(true);
                    setCurrAddonCategory({
                      id: item.id,
                      name: item.name,
                      is_required: item.is_required,
                    });
                  }}
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
            <div>No Menu Categories</div>
          )}
        </Stack>

        <ModalBox
          open={open}
          setOpen={setOpen}
          heading={`${
            !currAddonCategory.id ? "Create" : "Edit"
          } Addon Category`}
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
              autoComplete="off"
              required
            />

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
              is_required
            </label>
            {/* <Stack
              sx={{ width: "75%" }}
              direction={"row"}
              justifyContent={"space-around"}
              flexWrap={"wrap"}
            >
              <Typography variant="body2" align="left">
                {" "}
                Menus :
              </Typography>
              <Typography width={"50%"} variant="caption">
                {showMenus(currAddonCategory.id).join(", ")}
              </Typography>
            </Stack> */}
            <Button
              disabled={app.status === "loading"}
              variant="contained"
              type="submit"
              sx={{ alignSelf: "end" }}
            >
              Submit
            </Button>
          </Box>
        </ModalBox>
        <ConfirmationBox
          handleDelete={() => handleDelete(currAddonCategory.id)}
          open={openConfirmation}
          setOpen={setOpenConfirmation}
          heading="Are you sure to delete this because this might delete related menus?"
        />
      </RouteLayout>
    </PageLayout>
  );
};

export default MenuCategories;
