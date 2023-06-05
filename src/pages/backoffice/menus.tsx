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

const Menus = () => {
  const { locations } = React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [userSelectlocation, setUserSelectlocation] = React.useState("");
  const { query, push } = useRouter();
  const [menusList, setMenusList] = React.useState<Menu[]>([]);
  //   const [newMenu, setNewMenu] = React.useState<Menu>({
  //     name: "",
  //     price: "",

  //   });
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    locations.length === 0 && push("/backoffice/setting");
  }, []);

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
    console.log(e.target);
    // const formData = new FormData(e.target);
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
          ) : menusList.length > 0 ? (
            <>
              <IconButton onClick={() => setOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
              {menusList?.map((item) => (
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
              method="POST"
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
                name="assetUrl"
                type="file"
                accept="image/png, image/jpeg"
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

export default Menus;
