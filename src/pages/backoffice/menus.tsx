import PageLayout from "@/components/PageLayout";
import { RouteLayout } from "@/components/RouteLayout";
import BackOfficeContext from "@/contexts/BackofficeContext";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRouter } from "next/router";
import { Menu } from "../../typing/types";
import React from "react";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import { config } from "@/config/config";

// interface MyFormData extends FormData {
//   name: string;
//   price: string;
//   menuCategoryId: string;
//   locationId: string;
//   menuImg: File;
// }

const Menus = () => {
  const {
    locations,
    menuCategories,
    getMenuCategoriesByLocationId,
    getMenusByLocationsId,
    setMenus,
    menus,
  } = React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [userSelectlocation, setUserSelectlocation] = React.useState("");
  const [userSelectMenuCategory, setUserSelectMenuCategory] =
    React.useState("");
  const { query, push } = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    locations.length === 0 && push("/backoffice/setting");
  }, []);

  React.useEffect(() => {
    if (userSelectlocation) {
      getMenuCategoriesByLocationId(userSelectlocation);
      getMenusByLocationsId(userSelectlocation);
    }
  }, [userSelectlocation]);

  const createMenu = async (formData: FormData) => {
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/menus/create`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.status === 201) {
        const data = await response.json();
        console.log(data);
        setMenus((pre) => [...pre, data]);
        setOpen(false);
      } else {
        throw new Error("Failed to create a new menu-category");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    //setting the location value in query params
    push({ query: { ...query, location: event.target.value } }, undefined, {
      shallow: true,
    });
    //set search params of location
    setUserSelectlocation(event.target.value as string);
  };

  const handleSelectMenuCategory = (event: SelectChangeEvent) => {
    setUserSelectMenuCategory(event.target.value as string);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("locationId", userSelectlocation);
    // formData.forEach((el) => {
    //   console.log(el);
    // });
    createMenu(formData);
  };

  return (
    <PageLayout>
      <RouteLayout>
        <Box sx={{ mt: 2 }}>
          <Typography mb={1} variant="body1">
            Choose Your Location
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Location</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={userSelectlocation}
              label="Location"
              onChange={handleChange}
            >
              {locations?.map((el) => (
                <MenuItem key={el.id} value={el.id}>
                  {el.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Typography mt={3} mb={2} variant="h4">
          Menus
        </Typography>
        <Stack
          sx={{ maxWidth: "600px", mx: "auto" }}
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {!userSelectlocation ? (
            <div>Choose Location First</div>
          ) : menus.length > 0 ? (
            <>
              <IconButton onClick={() => setOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
              {menus?.map((item) => (
                <Chip
                  key={item.name}
                  label={item.name}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </>
          ) : (
            <div>
              <IconButton onClick={() => setOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </div>
          )}
        </Stack>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ModalDialog layout="center" size="lg">
            <ModalClose />
            <Typography my={2} align="center" variant="h5">
              Create Menu
            </Typography>
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
                  display: "block",
                  border: "1px solid red",
                }}
                name="menuImg"
                type="file"
                accept="image/png, image/jpeg"
              />
              <FormControl fullWidth>
                <InputLabel id="select-menuCategory">Menu Category</InputLabel>
                <Select
                  name="menuCategoryId"
                  labelId="select-menuCategory"
                  value={userSelectMenuCategory}
                  label="menu-category"
                  onChange={handleSelectMenuCategory}
                >
                  {menuCategories?.map((el) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                disabled={isLoading}
                variant="contained"
                type="submit"
                sx={{ alignSelf: "end" }}
              >
                Submit
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      </RouteLayout>
    </PageLayout>
  );
};

export default Menus;
