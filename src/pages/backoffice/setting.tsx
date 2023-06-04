import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { config } from "@/config/config";
import PageLayout from "@/components/PageLayout";
import { useRouter } from "next/router";

const Setting = () => {
  const { locations, setLocations, company } =
    React.useContext(BackOfficeContext);

  const { push, query } = useRouter();
  // const [_, setSearchParams] = useSearchParams();

  React.useEffect(() => {
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
    locations.length === 0 &&
      company.id !== 0 &&
      getLocations(
        `${config.baseurl}/backoffice/locations?companyId=${company.id}`
      );
  }, [company.id]);

  React.useEffect(() => {
    if (locations.length > 0 && query.location) {
      setUserSelectlocation(query.location as string);
    }
  }, [locations]);

  const [userSelectlocation, setUserSelectlocation] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    //setting the location value in query params
    push({ query: { ...query, location: event.target.value } }, undefined, {
      shallow: true,
    });
    //set search params of location
    setUserSelectlocation(event.target.value as string);
  };
  return (
    <PageLayout>
      <Box
        sx={{
          maxWidth: "500px",
          marginX: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 3,
        }}
      >
        <Typography mb={2} variant="h4">
          Choose Your Location
        </Typography>
        <Box sx={{ minWidth: 120 }}>
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
      </Box>
    </PageLayout>
  );
};

export default Setting;
