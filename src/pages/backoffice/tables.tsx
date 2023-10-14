import BackofficeLayout from "@/components/BackofficeLayout";
import ButtonBox from "@/components/ButtonBox";
import ConfirmationBox from "@/components/ConfirmationBox";
import CreateBtn from "@/components/CreateBtn";
import ModalBox from "@/components/ModalBox";
import { config } from "@/config/config";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { Location, Table } from "@/typing/types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Image from "next/image";
import Link from "next/link";
import qrcodeParser from "qrcode-parser";
import React, { useEffect, useState } from "react";

const initalTable = {
  id: 0,
  name: "",
  location: "",
  asset_url: "",
};

const Table = () => {
  const { app, setApp, selectedLocation } = React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);
  const [currTable, setCurrTable] = useState(initalTable);
  const [searchTable, setSearchTable] = useState<Table | null>(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [tableUrl, setTableUrl] = React.useState("");

  useEffect(() => {
    qrcodeParser(currTable.asset_url).then((url) => setTableUrl(url));
  }, [currTable.asset_url]);

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

  React.useEffect(() => {
    if (!open && searchTable) {
      setSearchTable(null);
    }
  }, [open]);

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

  const filterdTables = (locationId: number): Table[] =>
    app.tables.filter((item) => item.locations_id === locationId);

  const tableItems = selectedLocation.name
    ? filterdTables(selectedLocation.id)
    : app.tables;

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
        Tables
      </Typography>
      <Autocomplete
        size="small"
        options={tableItems}
        getOptionLabel={(option: Table) => option.name}
        onChange={(event: any, newValue) => {
          if (newValue) {
            setSearchTable(newValue);
            setOpen(true);
            setCurrTable({
              asset_url: newValue.asset_url,
              id: newValue.id,
              location: chgLocationIdtoName(
                newValue.locations_id,
                app.locations
              ),
              name: newValue.name,
            });
          }
        }}
        disablePortal
        value={searchTable}
        sx={{ width: 200, marginBottom: "1rem" }}
        isOptionEqualToValue={(option, value) =>
          typeof option.name === typeof value.name
        }
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
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
        sx={{ maxWidth: "400px", mx: "auto", px: 3, flexWrap: "wrap" }}
        alignItems="center"
        direction="row"
        gap={1}
      >
        <IconButton
          onClick={() => {
            setOpen(true);
            setCurrTable({ id: 0, name: "", location: "", asset_url: "" });
          }}
        >
          <AddCircleOutlineIcon color="primary" />
        </IconButton>
        {app.status === "loading" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : app.tables.length > 0 ? (
          <>
            {tableItems?.map((item) => (
              <Chip
                key={item.name}
                label={item.name}
                sx={{
                  cursor: "pointer",
                  color: "secondary.dark",
                  backgroundColor: "info.main",
                }}
                onClick={() => {
                  setOpen(true);
                  setCurrTable({
                    id: item.id,
                    name: item.name,
                    location: chgLocationIdtoName(
                      item.locations_id,
                      app.locations
                    ),
                    asset_url: item.asset_url,
                  });
                }}
              />
            ))}
          </>
        ) : (
          <div>No Tables Found</div>
        )}
      </Stack>

      <ModalBox
        setOpen={setOpen}
        open={open}
        heading={` ${!currTable.id ? "Create" : "Edit"} Table`}
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
            options={
              selectedLocation.name
                ? [selectedLocation.name]
                : app.locations.map((item) => item.name)
            }
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
            <CreateBtn createBtnDisabled={app.status === "loading"} />
          ) : (
            <>
              <Box>
                <Image
                  src={currTable.asset_url}
                  alt="QR code picture"
                  width={100}
                  height={100}
                />
              </Box>
              <Link href={tableUrl} target="_blank">
                Make Orders Here &#62;&#62;
              </Link>
              <ButtonBox
                delBtnClick={() => setOpenConfirmation(true)}
                editBtnDisabled={app.status === "loading"}
              />
            </>
          )}
        </Box>
      </ModalBox>
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
