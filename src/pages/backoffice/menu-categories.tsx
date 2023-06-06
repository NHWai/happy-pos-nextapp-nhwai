import React, { useState } from "react";
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
import { config } from "@/config/config";
import { MenuCategory } from "../../typing/types";
import { RouteLayout } from "../../components/RouteLayout";
import PageLayout from "@/components/PageLayout";
import { useRouter } from "next/router";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Modal from "@mui/joy/Modal";
import { ModalClose, ModalDialog } from "@mui/joy";
import BackOfficeContext from "@/contexts/BackofficeContext";

const MenuCategories = () => {
  const {
    locations,
    getMenuCategoriesByLocationId,
    menuCategories,
    setMenuCategories,
  } = React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [userSelectlocation, setUserSelectlocation] = React.useState("");
  const { query, push } = useRouter();
  const [newMenuCategory, setNewMenuCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    locations.length === 0 && push("/backoffice/setting");
  }, []);

  React.useEffect(() => {
    userSelectlocation && getMenuCategoriesByLocationId(userSelectlocation);
  }, [userSelectlocation]);

  const createMenuCategory = async () => {
    const body = {
      name: newMenuCategory,
      locationId: userSelectlocation,
    };
    try {
      const response = await fetch(
        `${config.baseurl}/backoffice/menu-categories/create`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setMenuCategories((pre) => [...pre, data]);
        setNewMenuCategory("");
        setOpen(false);
        setIsLoading(false);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    //creat newMenuCategories
    userSelectlocation && createMenuCategory();
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
          MenuCategories
        </Typography>
        <Stack
          sx={{ maxWidth: "600px", mx: "auto" }}
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {!userSelectlocation ? (
            <div>Choose Location First</div>
          ) : menuCategories.length > 0 ? (
            <>
              <IconButton onClick={() => setOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
              {menuCategories?.map((item) => (
                <Chip
                  key={item.name}
                  label={item.name}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </>
          ) : (
            <>
              <IconButton onClick={() => setOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
              <div>No Menu Categories</div>
            </>
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
              Create MenuCategory
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
            >
              <TextField
                variant="standard"
                label="name"
                name="newMenuCategory"
                value={newMenuCategory}
                onChange={(e) => setNewMenuCategory(e.target.value)}
                autoComplete="off"
                required
              />
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

export default MenuCategories;
