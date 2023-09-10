import BackofficeLayout from "@/components/BackofficeLayout";
import ButtonBox from "@/components/ButtonBox";
import ConfirmationBox from "@/components/ConfirmationBox";
import CreateBtn from "@/components/CreateBtn";
import ModalBox from "@/components/ModalBox";
import { config } from "@/config/config";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { Location } from "@/typing/types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
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
  const [searchLocation, setSearchLocation] = useState<Location | null>(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  React.useEffect(() => {
    if (app.error) {
      alert(app.error);
      setApp((pre) => ({ ...pre, status: "idle", error: "" }));
    }
  }, [app.error]);

  React.useEffect(() => {
    if (!open && searchLocation) {
      setSearchLocation(null);
    }
  }, [open]);

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
      <Typography my={2} variant="h4" color="secondary">
        Locations
      </Typography>
      <Autocomplete
        size="small"
        options={app.locations}
        getOptionLabel={(option: Location) => option.name}
        onChange={(event: any, newValue) => {
          if (newValue) {
            setSearchLocation(newValue);
            setOpen(true);
            setCurrLocation(newValue);
          }
        }}
        disablePortal
        value={searchLocation}
        sx={{ width: 200, marginBottom: "1rem" }}
        isOptionEqualToValue={(option, value) =>
          typeof option.name === typeof value.name
        }
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
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
            <AddCircleOutlineIcon color="primary" />
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
                sx={{
                  cursor: "pointer",
                  color: "secondary.dark",
                  backgroundColor: "info.main",
                }}
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

      <ModalBox
        setOpen={setOpen}
        open={open}
        heading={` ${!currLocation.id ? "Create" : "Edit"} Location`}
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
