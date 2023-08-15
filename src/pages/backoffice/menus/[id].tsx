import BackofficeLayout from "@/components/BackofficeLayout";
import ConfirmationBox from "@/components/ConfirmationBox";
import LetterBox from "@/components/LetterBox";
import ModalBox from "@/components/ModalBox";
import { config } from "@/config/config";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { Location, Menu, MenuCategory } from "@/typing/types";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

const defaultUrl =
  "https://msquarefdc.sgp1.digitaloceanspaces.com/happy-pos/nhwai/1687062252572_default.jfif";

const MenuItem = () => {
  const { company, app, setApp, selectedLocation } =
    useContext(BackOfficeContext);
  const router = useRouter();
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
  const [menuItem, setMenuItem] = useState<Menu>({
    id: 0,
    locationArr: [],
    menuCategoryArr: [],
    addonCategoryArr: [],
    name: "",
    price: 0,
  });
  console.log(menuItem.asset_url);
  const [openConfirmation, setOpenConfirmation] =
    React.useState<boolean>(false);

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

  useEffect(() => {
    if (app.error) {
      alert(app.error);
      setApp((pre) => ({ ...pre, status: "idle", error: "" }));
    }
  }, [app.error]);

  useEffect(() => {
    if (router.query.id && app.menus.length > 0) {
      const currItem = app.menus
        .filter((menu) => menu.id === Number(router.query.id))
        .pop();
      if (currItem) {
        setMenuItem(currItem);
      }
    }
  }, [router.query.id, app]);

  const filteredNames = (
    currArr: { id: number; is_available?: boolean }[],
    originArr: MenuCategory[] | Location[]
  ): string[] => {
    return currArr
      .map((el) => originArr.find((item) => item.id === el.id))
      .map((item) => item?.name as string)
      .filter((item, idx, arr) => arr.indexOf(item) === idx);
  };

  const filteredAvailableLocations = (
    currArr: { id: number; is_available: boolean }[],
    originArr: Location[]
  ): string[] => {
    const returnArr = currArr
      .map((el) =>
        originArr.find((item) => item.id === el.id && el.is_available)
      )
      .map((item) => item?.name as string)
      .filter((item, idx, arr) => arr.indexOf(item) === idx && item);

    return returnArr;
  };

  const updateMenu = async (formData: FormData) => {
    try {
      const response = await fetch(`${config.baseurl}/backoffice/menus/edit`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();

        setApp((pre) => ({
          ...pre,
          menus: pre.menus.map((el) => (el.id === data.id ? data : el)),
          error: "",
          status: "idle",
        }));
        setOpen(false);
        setSelectedLocations([]);
        setSelectedMenuCategories([]);
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

    interface EditedLocationObjArr {
      is_available: boolean;
      name: string;
      id: number;
    }

    let editedLocationObjArr: EditedLocationObjArr[] = [
      {
        is_available: false,
        name: "",
        id: 0,
      },
    ];

    if (!selectedLocation.id) {
      editedLocationObjArr = selectedLocations
        .map((el) => app.locations.find((loc) => loc.name === el))
        .filter((item): item is Location => item !== undefined)
        .map((el) => ({
          is_available: !!formData.get(el.name),
          id: el.id,
          name: el.name,
        }));
    } else {
      const getLocationName = (id: number): string =>
        app.locations.find((item) => item.id === id)?.name as string;
      editedLocationObjArr = menuItem.locationArr
        .map((item) => ({
          ...item,
          name: getLocationName(item.id),
        }))
        .map((item) => ({
          ...item,
          is_available:
            item.name === selectedLocation.name
              ? !!formData.get(item.name)
              : item.is_available,
        }));
    }

    const editedMenuCategoriesObjArr = selectedMenuCategories
      .map((el) => app.menuCategories.find((cat) => cat.name === el))
      .map((el) => ({ id: el?.id, name: el?.name }));

    const editedMenuMenuCategoryLocation = editedMenuCategoriesObjArr
      .map((el) =>
        editedLocationObjArr.map((item) => ({
          menus_id: menuItem.id,
          menu_categories_id: el.id,
          locations_id: item.id,
          is_available: item.is_available,
        }))
      )
      .flat()
      .map((item) => JSON.stringify(item));

    const originalMenuMenuCategoryLocation = menuItem.menuCategoryArr
      .map((el) =>
        menuItem.locationArr.map((item) => ({
          menus_id: menuItem.id,
          menu_categories_id: el.id,
          locations_id: item.id,
          is_available: item.is_available,
        }))
      )
      .flat()
      .map((item) => JSON.stringify(item));

    const removeItems = originalMenuMenuCategoryLocation
      .filter((item) => !editedMenuMenuCategoryLocation.includes(item))
      .map((item) => JSON.parse(item));

    const addItems = editedMenuMenuCategoryLocation
      .filter((item) => !originalMenuMenuCategoryLocation.includes(item))
      .map((item) => JSON.parse(item));

    const addonCategoryIds = app.addonCategories
      .filter((item) => selectedAddonCategories.find((el) => el === item.name))
      .map((item) => item.id);

    dropZoneFiles.length > 0 && formData.append("menuImg", dropZoneFiles[0]);
    formData.append("removeItems", JSON.stringify(removeItems));
    formData.append("addItems", JSON.stringify(addItems));
    formData.append("companyId", String(company.id));
    formData.append("menuId", String(menuItem.id));
    formData.append("addonCategoryIds", JSON.stringify(addonCategoryIds));

    // for (var [key, value] of formData.entries()) {
    //   console.log(key, "-->", value);
    // }

    setApp((pre) => ({
      ...pre,
      error: "",
      status: "loading",
    }));
    updateMenu(formData);
  };

  const handleDelete = async (id: number) => {
    setApp((pre) => ({ ...pre, status: "loading" }));
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/menus/delete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setApp((pre) => ({
          ...pre,
          menus: pre.menus.filter((menu) => menu.id !== id),
          status: "idle",
        }));
        // setOpenConfirmation(false);
        router.push("/backoffice/menus");
      } else {
        throw new Error("Failed to delete current menu ");
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
      {app.status === "loading" ? (
        <Box
          sx={{
            display: "flex",
            mt: "30vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : app.status === "idle" && app.menus.length > 0 && menuItem.id ? (
        <>
          <Box
            sx={{
              mt: 2,
              width: "100%",
              minWidth: "270px",
              maxWidth: "350px",
              paddingBottom: "2rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mb: 2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{ textDecoration: "none" }}
                component={Link}
                href="/backoffice/menus"
              >
                <KeyboardBackspaceIcon color="secondary" />
              </Box>
              <Stack direction={"row"}>
                <IconButton
                  onClick={() => {
                    setOpen(true);
                    setSelectedMenuCategories(
                      filteredNames(
                        menuItem.menuCategoryArr,
                        app.menuCategories
                      )
                    );
                    setSelectedLocations(
                      filteredNames(menuItem.locationArr, app.locations)
                    );
                    setSelectedAddonCategories(
                      filteredNames(
                        menuItem.addonCategoryArr,
                        app.addonCategories
                      )
                    );
                    setDropZoneFiles([]);
                  }}
                >
                  <EditIcon color="secondary" />
                </IconButton>
                {!selectedLocation.id && (
                  <IconButton onClick={() => setOpenConfirmation(true)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </Stack>
            </Box>
            <Typography align="center" variant="h3" color="secondary">
              {menuItem.name}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
              <img width={200} height={150} src={menuItem.asset_url} />
            </Box>
            <LetterBox label="Price" value={`${menuItem.price}MMK`} />
            <LetterBox
              label="Menu Categories"
              value={filteredNames(
                menuItem.menuCategoryArr,
                app.menuCategories
              ).join(", ")}
            />
            <LetterBox
              label="Addon Categories"
              value={filteredNames(
                menuItem.addonCategoryArr,
                app.addonCategories
              ).join(", ")}
            />
            <LetterBox
              label=" All Locations"
              value={filteredNames(menuItem.locationArr, app.locations).join(
                ", "
              )}
            />
            <LetterBox
              label=" Ava Locations"
              value={filteredAvailableLocations(
                menuItem.locationArr,
                app.locations
              ).join(", ")}
            />
          </Box>
          <ModalBox setOpen={setOpen} open={open} heading="Edit Menu">
            <Box
              onSubmit={handleSubmit}
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
              }}
              encType="multipart/form-data"
            >
              <TextField
                defaultValue={menuItem.name}
                variant="standard"
                label="name"
                name="name"
                autoComplete="off"
                required
                inputProps={{ readOnly: !!selectedLocation.id }}
              />
              <TextField
                defaultValue={menuItem.price}
                variant="standard"
                label="price"
                name="price"
                autoComplete="off"
                required
                type="number"
                inputProps={{ readOnly: !!selectedLocation.id }}
              />

              <Box
                sx={{
                  width: "180px",
                  backgroundColor: "info.main",
                  color: "secondary.main",
                  padding: "1rem",
                  borderRadius: "1rem",
                  cursor: "pointer",
                  border: " dashed #41644A",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {dropZoneFiles.length > 0 ? (
                  <Typography variant="body2">{files}</Typography>
                ) : menuItem.asset_url === defaultUrl ? (
                  <Typography>Default Image</Typography>
                ) : (
                  <p>{`${menuItem.name.toLowerCase().replace(" ", "")}.jpg`}</p>
                )}
              </Box>

              <Autocomplete
                multiple
                size="small"
                options={app.menuCategories?.map((item) => item.name)}
                disablePortal
                value={selectedMenuCategories}
                onChange={(event: any, newValue: string[]) =>
                  setSelectedMenuCategories(newValue)
                }
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField {...params} label="Choose Menu Categories" />
                )}
                readOnly={!!selectedLocation.name}
              />

              <Autocomplete
                multiple
                size="small"
                options={app.addonCategories?.map((item) => item.name)}
                disablePortal
                value={selectedAddonCategories}
                onChange={(event: any, newValue: string[]) =>
                  setSelectedAddonCategories(newValue)
                }
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField {...params} label="Choose Addon Categories" />
                )}
                readOnly={!!selectedLocation.name}
              />

              <Autocomplete
                readOnly={!!selectedLocation.name}
                multiple
                freeSolo
                size="small"
                options={app.locations?.map((item) => item.name)}
                disablePortal
                value={selectedLocations}
                onChange={(event: any, newValue: string[]) =>
                  setSelectedLocations(newValue)
                }
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField {...params} label="Choose Locations" />
                )}
              />

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <span>Item is availiable in :</span>
                {selectedLocations.map((el, idx) => (
                  <label key={idx}>
                    <input
                      disabled={
                        !!selectedLocation.id
                          ? selectedLocation.name !== el
                          : false
                      }
                      defaultChecked={
                        menuItem.locationArr[idx]
                          ? menuItem.locationArr[idx].is_available
                          : true
                      }
                      name={el}
                      type="checkbox"
                    />
                    {el}
                  </label>
                ))}
              </Box>

              <Button
                // disabled={menus.status === "loading"}
                variant="contained"
                type="submit"
                sx={{ alignSelf: "end" }}
              >
                Submit
              </Button>
            </Box>
          </ModalBox>{" "}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            mt: "30vh",
          }}
        >
          No menu item for given id
        </Box>
      )}
      <ConfirmationBox
        handleDelete={() => handleDelete(menuItem.id)}
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        heading="Are you sure to delete this menu?"
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

export default MenuItem;
