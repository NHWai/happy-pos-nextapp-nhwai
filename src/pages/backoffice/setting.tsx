import React from "react";
import { Autocomplete, Chip, TextField, Typography } from "@mui/material";
import BackOfficeContext from "@/contexts/BackofficeContext";
import PageLayout from "@/components/BackofficeLayout";
import { initialLocation } from "@/contexts/BackofficeContext";

const Setting = () => {
  const { app, selectedLocation, setSelectedLocation, getOrders } =
    React.useContext(BackOfficeContext);

  return (
    <PageLayout>
      <Typography my={2} variant="h4">
        Choose Locations
      </Typography>
      <Autocomplete
        size="small"
        options={app?.locations.map((item) => item.name)}
        disablePortal
        value={selectedLocation.name}
        isOptionEqualToValue={(option, value) => typeof option === typeof value}
        onChange={(event: any, newValue: string | null) => {
          const selecLocName = app.locations.find(
            (item) => item.name === newValue
          );
          selecLocName
            ? setSelectedLocation(selecLocName)
            : setSelectedLocation(initialLocation);
        }}
        sx={{ width: 200 }}
        renderInput={(params) => (
          <TextField {...params} label="Choose Locations" />
        )}
      />
    </PageLayout>
  );
};

export default Setting;
