import PageLayout from "@/components/BackofficeLayout";
import LetterBox from "@/components/LetterBox";
import BackOfficeContext, {
  initialLocation,
} from "@/contexts/BackofficeContext";
import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material";
import React from "react";

const Setting = () => {
  const { app, selectedLocation, setSelectedLocation, company } =
    React.useContext(BackOfficeContext);

  return (
    <PageLayout>
      <Typography my={2} variant="h4" color="secondary">
        Setting
      </Typography>
      <Stack alignItems={"center"} sx={{ marginBottom: 1 }}>
        <Typography
          variant="body2"
          color="secondary"
          textAlign={"center"}
          marginBottom={1}
        >
          Select location to see items in a specific location
        </Typography>
        <Autocomplete
          size="small"
          options={app?.locations.map((item) => item.name)}
          disablePortal
          value={selectedLocation.name}
          isOptionEqualToValue={(option, value) =>
            typeof option === typeof value
          }
          onChange={(event: any, newValue: string | null) => {
            const selecLocName = app.locations.find(
              (item) => item.name === newValue
            );
            selecLocName
              ? setSelectedLocation(selecLocName)
              : setSelectedLocation(initialLocation);
          }}
          sx={{ width: 200, marginBottom: "1rem" }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Locations" />
          )}
        />
      </Stack>
      <Stack spacing={1} marginBottom={1}>
        <LetterBox label="Your Role" value={`owner`} />
        <LetterBox label="Company Name" value={company.name} />
        <LetterBox label="Address" value={company.address} />
        <LetterBox label="Menus" value={`${app.menus.length} nos`} />
        <LetterBox
          label="Menu Categories"
          value={`${app.menuCategories.length} nos`}
        />
        <LetterBox label="Addons" value={`${app.addons.length} nos`} />
        <LetterBox
          label="Addon Categories"
          value={`${app.addonCategories.length} nos`}
        />
        <LetterBox label="Tables" value={`${app.tables.length} nos`} />
        <LetterBox label="Locations" value={`${app.locations.length} nos`} />
      </Stack>
    </PageLayout>
  );
};

export default Setting;
