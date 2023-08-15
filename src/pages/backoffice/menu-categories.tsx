import BackofficeLayout from "@/components/BackofficeLayout";
import ConfirmationBox from "@/components/ConfirmationBox";
import LetterBox from "@/components/LetterBox";
import ModalBox from "@/components/ModalBox";
import { config } from "@/config/config";
import BackOfficeContext from "@/contexts/BackofficeContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
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

const initialMenuCategory = { id: 0, name: "" };

const MenuCategories = () => {
  const { company, app, setApp, selectedLocation } =
    React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);
  const [userSelectlocation, setUserSelectlocation] = React.useState<
    string | null
  >("");
  const [currMenuCategory, setCurrMenuCategory] = useState(initialMenuCategory);
  const [openSnackBar, setOpenSnackBar] = useState(false);

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

  const createMenuCategory = async () => {
    const body = {
      name: currMenuCategory.name,
      companyId: company.id,
    };
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/menu-categories/create`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setApp((pre) => ({
          ...pre,
          menuCategories: [...pre.menuCategories, data],
          status: "idle",
          error: "",
        }));
        setCurrMenuCategory(initialMenuCategory);
        setOpen(false);
      } else {
        throw new Error(
          `Failed to create a new menu-category  \n Status Code: ${response.status}`
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

  const updateMenuCategory = async () => {
    const body = {
      id: currMenuCategory.id,
      name: currMenuCategory.name,
      companyId: company.id,
    };
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/menu-categories/edit`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setApp((pre) => ({
          ...pre,
          menuCategories: pre.menuCategories.map((item) =>
            item.id === currMenuCategory.id ? data : item
          ),
          status: "idle",
          error: "",
        }));
        setCurrMenuCategory(initialMenuCategory);
        setOpen(false);
      } else {
        throw new Error(
          `Failed to update a new menu-category  \n Status Code: ${response.status}`
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isInvalidInput = !currMenuCategory.name;

    if (isInvalidInput) {
      setOpenSnackBar(true);
      return;
    }

    setApp((pre) => ({ ...pre, status: "loading" }));
    if (!currMenuCategory.id) {
      //creat newMenuCategories
      company.id && createMenuCategory();
    } else {
      updateMenuCategory();
    }
  };

  const handleDelete = async (id: number) => {
    setApp((pre) => ({ ...pre, status: "loading" }));
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/menu-categories/delete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setApp((pre) => ({
          ...pre,
          menuCategories: pre.menuCategories.filter(
            (menuCategory) => menuCategory.id !== id
          ),
          menus: pre.menus
            .map((menuItem) => ({
              ...menuItem,
              menuCategoryArr: menuItem.menuCategoryArr.filter(
                (menuCat) => menuCat.id !== id
              ),
            }))
            .filter((menuItem) => menuItem.menuCategoryArr.length !== 0),
          status: "idle",
        }));
        setCurrMenuCategory(initialMenuCategory);
        setOpenConfirmation(false);
        setOpen(false);
      } else {
        throw new Error(
          `Failed to delete current menu category  \n Status Code: ${response.status}`
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

  return (
    <BackofficeLayout>
      <Typography mt={3} mb={2} variant="h4" color="secondary">
        MenuCategories
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
              setCurrMenuCategory(initialMenuCategory);
            }}
          >
            <AddCircleOutlineIcon color="primary" />
          </IconButton>
        )}
        {app.status === "loading" ? (
          <div>Loading</div>
        ) : app.status === "idle" && app.menuCategories?.length > 0 ? (
          <>
            {app.menuCategories?.map((item) => (
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
                  item.name + " \n (" + showMenus(item.id).length + " menu/s)"
                }
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpen(true);
                  setCurrMenuCategory({ id: item.id, name: item.name });
                }}
              />
            ))}
          </>
        ) : app.status === "idle" && app.menuCategories.length === 0 ? (
          <div>No Menu Categories</div>
        ) : (
          <></>
        )}
      </Stack>

      <ModalBox
        open={open}
        setOpen={setOpen}
        heading={`${!currMenuCategory.id ? "Create" : "Edit"} Menu Category`}
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
            value={currMenuCategory.name}
            onChange={(e) =>
              setCurrMenuCategory((pre) => ({ ...pre, name: e.target.value }))
            }
            autoComplete="off"
            sx={{ input: { color: "secondary.main" } }}
            required
          />
          <Box sx={{ marginLeft: "-5rem" }}>
            <LetterBox
              label="Menus"
              value={showMenus(currMenuCategory.id).join(", ")}
            />
          </Box>

          {!currMenuCategory.id ? (
            <Button
              disabled={app.status === "loading"}
              variant="contained"
              type="submit"
              sx={{ alignSelf: "end" }}
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
        handleDelete={() => handleDelete(currMenuCategory.id)}
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
