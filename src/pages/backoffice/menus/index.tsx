import PageLayout from "@/components/PageLayout";
import { RouteLayout } from "@/components/RouteLayout";
import BackOfficeContext from "@/contexts/BackofficeContext";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React from "react";
import { config } from "@/config/config";
import ModalBox from "@/components/ModalBox";
import Link from "next/link";
import { Location } from "@/typing/types";

const Menus = () => {
  const { company, app, setApp } = React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>(
    []
  );
  const [selectedMenuCategories, setSelectedMenuCategories] = React.useState<
    string[]
  >([]);

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
      .map((el) => ({ name: el?.name, id: el?.id }));

    formData.append("selectedLocations", JSON.stringify(locationObjArr));
    formData.append(
      "selectedMenuCategories",
      JSON.stringify(menuCategoriesObjArr)
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

  return (
    <PageLayout>
      <RouteLayout>
        <Typography mt={3} mb={2} variant="h4">
          Menus
        </Typography>
        <Stack
          sx={{ maxWidth: "400px", mx: "auto", px: 3, flexWrap: "wrap" }}
          alignItems="center"
          direction="row"
          gap={1}
        >
          <IconButton onClick={() => setOpen(true)}>
            <AddCircleOutlineIcon />
          </IconButton>
          {app.status === "loading" ? (
            <div>Loading...</div>
          ) : app.status === "idle" && app.menus.length > 0 ? (
            app.menus?.map((item) => (
              <Chip
                href={"/backoffice/menus/" + item.id}
                component={Link}
                key={item.name}
                label={item.name}
                style={{ cursor: "pointer" }}
              />
            ))
          ) : app.status === "idle" && app.menus.length === 0 ? (
            <div>No Menus</div>
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
              gap: 4,
            }}
            encType="multipart/form-data"
          >
            <TextField
              variant="standard"
              label="name"
              name="name"
              autoComplete="off"
              required
            />
            <TextField
              variant="standard"
              label="price"
              name="price"
              autoComplete="off"
              required
              type="number"
            />

            <input
              style={{
                maxWidth: "180px",
              }}
              name="menuImg"
              type="file"
              accept="image/png, image/jpeg"
            />

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
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Choose Menu Categories" />
              )}
            />

            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={app?.locations.map((item) => item.name)}
              disablePortal
              value={selectedLocations}
              onChange={(event: any, newValue: string[]) =>
                setSelectedLocations(newValue)
              }
              sx={{ width: 200 }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
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
      </RouteLayout>
    </PageLayout>
  );
};

export default Menus;
