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
import PageLayout from "@/components/PageLayout";
import { useRouter } from "next/router";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { RouteLayout } from "@/components/RouteLayout";

const Setting = () => {
  const { locations, setLocations, company } =
    React.useContext(BackOfficeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
  });

  React.useEffect(() => {
    locations.length === 0 &&
      company.id !== 0 &&
      getLocations(
        `${config.baseurl}/backoffice/locations?companyId=${company.id}`
      );
  }, [company.id]);

  const getLocations = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (response.status === 200) {
        const data = await response.json();
        setLocations(data);
      } else {
        throw new Error(await response.json());
      }
    } catch (err) {
      console.log(err);
    }
  };

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
        setLocations(data);
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
    company.id && createLocations();
  };

  return (
    <PageLayout>
      <RouteLayout>
        <Typography my={2} variant="h4">
          Locations
        </Typography>
        <Stack
          sx={{ maxWidth: "600px" }}
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {locations.length > 0 ? (
            <>
              <IconButton onClick={() => setOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
              {locations?.map((item) => (
                <Chip
                  key={item.name}
                  label={item.name}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </>
          ) : (
            <div>Loading...</div>
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
              Create Location
            </Typography>
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
              <Button
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

export default Setting;
