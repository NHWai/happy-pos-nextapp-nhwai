import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { config } from "@/config/config";
import PageLayout from "@/components/BackofficeLayout";
import Modal from "@/components/ModalBox";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Setting = () => {
  const { locations, setLocations, getLocationsByCompanyId, company } =
    React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
  });

  React.useEffect(() => {
    if (locations.items.length === 0 && company.id !== 0) {
      setLocations((pre) => ({ ...pre, status: "loading" }));
      getLocationsByCompanyId(company.id);
    }
  }, [company.id]);

  const createLocations = async () => {
    const body = {
      ...newLocation,
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

      if (response.status === 200) {
        const data = await response.json();
        setLocations((pre) => ({
          ...pre,
          items: data,
          status: "idle",
          error: "",
        }));
        setNewLocation({
          name: "",
          address: "",
        });
        setOpen(false);
      } else {
        throw new Error(await response.json());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewLocationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewLocation((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleNewLocationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (company.id) {
      setLocations((pre) => ({ ...pre, status: "loading" }));
      createLocations();
    }
  };

  return (
    <PageLayout>
      <Typography my={2} variant="h4">
        Locations
      </Typography>
      <Stack
        sx={{ maxWidth: "600px" }}
        alignItems="center"
        direction="row"
        spacing={2}
      >
        {locations.status === "loading" ? (
          <div>Loading...</div>
        ) : locations.items.length > 0 ? (
          <>
            <IconButton onClick={() => setOpen(true)}>
              <AddCircleOutlineIcon />
            </IconButton>
            {locations.items?.map((item) => (
              <Chip
                key={item.name}
                label={item.name}
                style={{ cursor: "pointer" }}
              />
            ))}
          </>
        ) : (
          <div>No Locations Found</div>
        )}
      </Stack>

      <Modal setOpen={setOpen} open={open} heading="Create Location">
        <Box
          onSubmit={handleNewLocationSubmit}
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
            value={newLocation.name}
            onChange={handleNewLocationChange}
            autoComplete="off"
            required
          />
          <TextField
            variant="standard"
            label="address"
            name="address"
            value={newLocation.address}
            onChange={handleNewLocationChange}
            autoComplete="off"
            required
          />
          <Button variant="contained" type="submit" sx={{ alignSelf: "end" }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </PageLayout>
  );
};

export default Setting;
