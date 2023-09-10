import BackofficeLayout from "@/components/BackofficeLayout";
import CreateBtn from "@/components/CreateBtn";
import DropFileBox from "@/components/DropFileBox";

import ModalBox from "@/components/ModalBox";
import { config } from "@/config/config";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { AddonCategory, Location, MenuCategory } from "@/typing/types";
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
import Link from "next/link";
import React from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

const Menus = () => {
  const { company, app, setApp, selectedLocation } =
    React.useContext(BackOfficeContext);
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

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [dropZoneFiles, setDropZoneFiles] = React.useState<File[]>([]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setDropZoneFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/png": [".png", ".jpg", ".jfif"],
    },
  });

  const files = dropZoneFiles.map((file: FileWithPath) => (
    <div key={file.path}>{file.path}</div>
  ));

  const createMenu = async (formData: FormData) => {
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/menus/create`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setApp((pre) => ({
          ...pre,
          menus: [...pre.menus, data],
          error: "",
          status: "idle",
        }));
        setOpen(false);
        setSelectedLocations([]);
        setSelectedMenuCategories([]);
        setSelectedAddonCategories([]);
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

    //
    const locationObjArr = selectedLocations
      .map((el) => app.locations.find((loc) => loc.name === el))
      .filter((item): item is Location => item !== undefined)
      .map((el) => ({
        is_available: !!formData.get(el.name),
        id: el.id,
        name: el.name,
      }));

    const menuCategoriesObjArr = selectedMenuCategories
      .map((el) => app.menuCategories.find((item) => item.name === el))
      .filter((item): item is MenuCategory => item !== undefined)
      .map((el) => ({ name: el.name, id: el.id }));

    const addonCategoriesObjArr = selectedAddonCategories
      .map((el) => app.addonCategories.find((item) => item.name === el))
      .filter((item): item is AddonCategory => item !== undefined)
      .map((el) => ({ name: el.name, id: el.id }));

    formData.append("menuImg", dropZoneFiles[0]);
    formData.append("selectedLocations", JSON.stringify(locationObjArr));
    formData.append(
      "selectedMenuCategories",
      JSON.stringify(menuCategoriesObjArr)
    );
    formData.append(
      "selectedAddonCategories",
      JSON.stringify(addonCategoriesObjArr)
    );
    formData.append("companyId", String(company.id));

    // for (var [key, value] of formData.entries()) {
    //   console.log(key, "-->", value);
    // }
    setApp((pre) => ({
      ...pre,
      error: "",
      status: "loading",
    }));
    createMenu(formData);
  };

  const filteredMenus = (locationId: number) => {
    return app.menus.filter((menu) =>
      menu.locationArr.find((item) => item.id === locationId)
    );
  };

  const menuItems = selectedLocation.id
    ? filteredMenus(selectedLocation.id)
    : app.menus;

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
        Menus
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
        sx={{ maxWidth: "400px", mx: "auto", px: 3, flexWrap: "wrap" }}
        alignItems="center"
        direction="row"
        gap={1}
      >
        {!selectedLocation.id && (
          <IconButton
            onClick={() => {
              setOpen(true);
              setDropZoneFiles([]);
            }}
          >
            <AddCircleOutlineIcon color="primary" />
          </IconButton>
        )}
        {app.status === "loading" ? (
          <div>Loading...</div>
        ) : app.status === "idle" && app.menus.length > 0 ? (
          menuItems.map((item) => (
            <Chip
              href={"/backoffice/menus/" + item.id}
              component={Link}
              key={item.name}
              label={item.name}
              sx={{
                cursor: "pointer",
                color: "secondary.dark",
                backgroundColor: "info.main",
              }}
            />
          ))
        ) : app.status === "idle" && app.menus.length === 0 ? (
          <Typography color="secondary" variant="body1">
            No Menus
          </Typography>
        ) : null}
      </Stack>
      <ModalBox setOpen={setOpen} open={open} heading="Create Menu">
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
          encType="multipart/form-data"
        >
          <TextField
            size="small"
            variant="standard"
            label="name"
            name="name"
            autoComplete="off"
            required
          />
          <TextField
            size="small"
            variant="standard"
            label="price"
            name="price"
            autoComplete="off"
            required
            type="number"
          />

          <DropFileBox>
            <Box {...getRootProps()}>
              <input {...getInputProps()} />
              {dropZoneFiles.length > 0 ? (
                <Typography variant="body2">{files}</Typography>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </Box>
          </DropFileBox>

          <Autocomplete
            multiple
            size="small"
            options={app?.menuCategories.map((item) => item.name)}
            disablePortal
            value={selectedMenuCategories}
            onChange={(event: any, newValue: string[]) =>
              setSelectedMenuCategories(newValue)
            }
            sx={{ width: 200 }}
            renderInput={(params) => (
              <TextField {...params} label="Choose Menu Categories" />
            )}
          />

          <Autocomplete
            multiple
            size="small"
            options={app?.addonCategories.map((item) => item.name)}
            disablePortal
            value={selectedAddonCategories}
            onChange={(event: any, newValue: string[]) =>
              setSelectedAddonCategories(newValue)
            }
            sx={{ width: 200 }}
            renderInput={(params) => (
              <TextField {...params} label="Choose Addon Categories" />
            )}
          />

          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={
              selectedLocation.name
                ? [selectedLocation.name]
                : app?.locations.map((item) => item.name)
            }
            disablePortal
            value={selectedLocations}
            onChange={(event: any, newValue: string[]) =>
              setSelectedLocations(newValue)
            }
            sx={{ width: 200 }}
            renderInput={(params) => (
              <TextField
                name="locations"
                {...params}
                label="Choose Locations"
              />
            )}
          />

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <span>Is this item availiable in : </span>
            {selectedLocations.map((el) => (
              <label key={el}>
                <input defaultChecked={true} name={el} type="checkbox" />
                {el}
              </label>
            ))}
          </Box>
          <CreateBtn createBtnDisabled={app.status === "loading"} />
        </Box>
      </ModalBox>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
        message="Please fill up valid input values"
        action={action}
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

export default Menus;
