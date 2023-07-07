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
import Autocomplete from "@mui/material/Autocomplete";
import { Location } from "@/typing/types";
import CloseIcon from "@mui/icons-material/Close";

const initalTable = {
  id: 0,
  name: "",
  location: "",
};

const Table = () => {
  const { app, setApp } = React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);
  const [currTable, setCurrTable] = useState(initalTable);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const chgLocationNametoId = (
    locationName: string,
    locationsArr: Location[]
  ): number => {
    return locationsArr.filter((loc) => loc.name === locationName)[0].id;
  };

  const chgLocationIdtoName = (
    locationId: number,
    locationsArr: Location[]
  ): string => {
    return locationsArr.filter((loc) => loc.id === locationId)[0].name;
  };

  React.useEffect(() => {
    if (app.error) {
      alert(app.error);
      setApp((pre) => ({ ...pre, status: "idle", error: "" }));
    }
  }, [app.error]);

  const createLocation = async () => {
    const body = {
      name: currTable.name,
      locationId: chgLocationNametoId(currTable.location, app.locations),
    };

    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/tables/create`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const data = await response.json();

        setApp((pre) => ({
          ...pre,
          tables: [...pre.tables, data],
          status: "idle",
          error: "",
        }));
        setCurrTable(initalTable);
        setOpen(false);
      } else {
        throw new Error("Failed to create a new table");
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
      id: currTable.id,
      name: currTable.name,
    };
    try {
      const response = await fetch(`${config.baseurl}/backoffice/tables/edit`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setApp((pre) => ({
          ...pre,
          tables: pre.tables.map((item) =>
            item.id === currTable.id ? data : item
          ),
          status: "idle",
          error: "",
        }));
        setCurrTable(initalTable);
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
        `${config.baseurl}/backoffice/tables/delete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setApp((pre) => ({
          ...pre,
          tables: pre.tables.filter((location) => location.id !== id),
          status: "idle",
        }));
        setOpenConfirmation(false);
        setOpen(false);
      } else {
        throw new Error("Failed to delete current table");
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
    setCurrTable((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputNotValid = !currTable.name || !currTable.location;

    if (inputNotValid) {
      setOpenSnackBar(true);
      return;
    }

    setApp((pre) => ({ ...pre, status: "loading" }));
    if (!currTable.id) {
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
        Tables
      </Typography>
      <Stack
        sx={{ maxWidth: "400px", mx: "auto", px: 3, flexWrap: "wrap" }}
        alignItems="center"
        direction="row"
        gap={1}
      >
        <IconButton
          onClick={() => {
            setOpen(true);
            setCurrTable({ id: 0, name: "", location: "" });
          }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
        {app.status === "loading" ? (
          <div>Loading...</div>
        ) : app.tables.length > 0 ? (
          <>
            {app.tables?.map((item) => (
              <Chip
                key={item.name}
                label={item.name}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpen(true);
                  setCurrTable({
                    id: item.id,
                    name: item.name,
                    location: chgLocationIdtoName(
                      item.locations_id,
                      app.locations
                    ),
                  });
                }}
              />
            ))}
          </>
        ) : (
          <div>No Tables Found</div>
        )}
      </Stack>

      <Modal
        setOpen={setOpen}
        open={open}
        heading={` ${!currTable.name ? "Create" : "Edit"} Table`}
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
            name="name"
            value={currTable.name}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          {/* //choose locations from list */}

          <Autocomplete
            value={currTable.location}
            onChange={(event: any, newValue: string | null) => {
              typeof newValue === "string" &&
                setCurrTable((pre) => ({ ...pre, location: newValue }));
            }}
            options={app.locations.map((item) => item.name)}
            isOptionEqualToValue={(option, value) =>
              typeof option === typeof value
            }
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Choose Locations" required />
            )}
            readOnly={!!currTable.id}
          />

          {!currTable.id ? (
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
      </Modal>
      <ConfirmationBox
        handleDelete={() => handleDelete(currTable.id)}
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        heading="Are you sure to delete this table?"
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

export default Table;
