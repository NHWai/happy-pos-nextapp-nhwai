import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import { config } from "@/config/config";
import { RouteLayout } from "../../components/RouteLayout";
import PageLayout from "@/components/PageLayout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BackOfficeContext from "@/contexts/BackofficeContext";
import ModalBox from "@/components/ModalBox";
import ConfirmationBox from "@/components/ConfirmationBox";
import CloseIcon from "@mui/icons-material/Close";

const MenuCategories = () => {
  const { company, app, setApp } = React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);
  const [userSelectlocation, setUserSelectlocation] = React.useState<
    string | null
  >("");
  const [currMenuCategory, setCurrMenuCategory] = useState({ id: 0, name: "" });
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
        setCurrMenuCategory({ id: 0, name: "" });
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
        setCurrMenuCategory({ id: 0, name: "" });
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
          status: "idle",
        }));
        setCurrMenuCategory({
          id: 0,
          name: "",
        });
        setOpenConfirmation(false);
        setOpen(false);
      } else {
        throw new Error("Failed to delete current menu category");
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

  console.log(app.status, app.menuCategories);

  return (
    <PageLayout>
      <RouteLayout>
        <Typography mt={3} mb={2} variant="h4">
          MenuCategories
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
              setCurrMenuCategory({ id: 0, name: "" });
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
          {app.status === "loading" ? (
            <div>Loading</div>
          ) : app.status === "idle" && app.menuCategories?.length > 0 ? (
            <>
              {app.menuCategories?.map((item) => (
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
              required
            />
            <Stack
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
                {showMenus(currMenuCategory.id).join(", ")}
              </Typography>
            </Stack>

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
      </RouteLayout>
    </PageLayout>
  );
};

export default MenuCategories;
