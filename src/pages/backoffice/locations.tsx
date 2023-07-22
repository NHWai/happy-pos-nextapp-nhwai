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
import BackOfficeContext from "@/contexts/BackofficeContext";
import { config } from "@/config/config";
import BackofficeLayout from "@/components/BackofficeLayout";
import Modal from "@/components/ModalBox";
import ConfirmationBox from "@/components/ConfirmationBox";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const initialLocation = {
  id: 0,
  name: "",
  address: "",
};

const Location = () => {
  const { company, app, setApp, selectedLocation } =
    React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);
  const [currLocation, setCurrLocation] = useState(initialLocation);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  React.useEffect(() => {
    if (app.error) {
      alert(app.error);
      setApp((pre) => ({ ...pre, status: "idle", error: "" }));
    }
  }, [app.error]);

  const createLocation = async () => {
    const body = {
      ...currLocation,
      companyId: company.id,
    };
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/locations/create`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const data = await response.json();

        setApp((pre) => ({
          ...pre,
          locations: [...pre.locations, data],
          status: "idle",
          error: "",
        }));
        setCurrLocation(initialLocation);
        setOpen(false);
      } else {
        throw new Error("Failed to create a new location");
      }
    } catch (error) {
      setApp((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
    }
  };

  const updateLocation = async () => {
    const body = {
      ...currLocation,
      companies_id: company.id,
    };
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/locations/edit`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApp((pre) => ({
          ...pre,
          locations: pre.locations.map((item) =>
            item.id === currLocation.id ? data : item
          ),
          status: "idle",
          error: "",
        }));
        setCurrLocation(initialLocation);
        setOpen(false);
      } else {
        throw new Error(
          `Failed to update the location \n Status code : ${response.status}`
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

  const handleDelete = async (id: number) => {
    setApp((pre) => ({ ...pre, status: "loading" }));
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/locations/delete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setApp((pre) => ({
          ...pre,
          locations: pre.locations.filter((location) => location.id !== id),
          menus: pre.menus
            .map((menuItem) => ({
              ...menuItem,
              locationArr: menuItem.locationArr.filter(
                (location) => location.id !== id
              ),
            }))
            .filter((menuItem) => menuItem.locationArr.length !== 0),
          status: "idle",
        }));
        setOpenConfirmation(false);
        setOpen(false);
      } else {
        throw new Error("Failed to delete current location");
      }
    } catch (error) {
      setApp((pre) => ({
        ...pre,
        status: "failed",
        error: error as string,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrLocation((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputNotValid = !currLocation.name || !currLocation.address;

    if (inputNotValid) {
      setOpenSnackBar(true);
      return;
    }

    setApp((pre) => ({ ...pre, status: "loading" }));
    if (!currLocation.id) {
      //create new location
      createLocation();
    } else {
      //update the location
      updateLocation();
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
      <Typography my={2} variant="h4">
        Locations
      </Typography>
      <Stack
        sx={{ maxWidth: "400px", mx: "auto", px: 3, flexWrap: "wrap" }}
        alignItems="center"
        direction="row"
        gap={1}
      >
        {!selectedLocation.id && (
          <IconButton
            onClick={() => {
              setOpen(true);
              setCurrLocation(initialLocation);
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        )}
        {app.status === "loading" ? (
          <div>Loading...</div>
        ) : app.locations.length > 0 ? (
          <>
            {app.locations?.map((item) => (
              <Chip
                key={item.id}
                label={item.name}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpen(true);
                  setCurrLocation({
                    id: item.id,
                    name: item.name,
                    address: item.address,
                  });
                }}
              />
            ))}
          </>
        ) : (
          <div>No Locations Found</div>
        )}
      </Stack>

      <Modal
        setOpen={setOpen}
        open={open}
        heading={` ${!currLocation.name ? "Create" : "Edit"} Location`}
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
            variant="standard"
            label="name"
            name="name"
            value={currLocation.name}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <TextField
            variant="standard"
            label="address"
            name="address"
            value={currLocation.address}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          {!currLocation.id ? (
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
      </Modal>
      <ConfirmationBox
        handleDelete={() => handleDelete(currLocation.id)}
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        heading="Are you sure to delete this because this might delete related menu categories and menus?"
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

export default Location;
