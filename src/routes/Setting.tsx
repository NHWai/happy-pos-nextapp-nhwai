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
import { AppContext } from "../components/AppContext";
import { config } from "../config/config";

export const Setting = () => {
  const { locations, setLocations } = React.useContext(AppContext);
  // const [_, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const getLocations = async (url: string) => {
      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (response.status === 200) {
          const data = await response.json();
          if (!localStorage.getItem("selectedLocation")) {
            localStorage.setItem(
              "selectedLocation",
              JSON.stringify(data[0].id)
            );
          }
          setLocations(data);
        } else {
          throw new Error(await response.json());
        }
      } catch (err) {
        console.log(err);
      }
    };
    locations.length === 0 && getLocations(`${config.baseurl}/locations`);
  }, []);

  const [userSelectlocation, setUserSelectlocation] = React.useState(
    localStorage.getItem("selectedLocation") || ""
  );

  const handleChange = (event: SelectChangeEvent) => {
    localStorage.setItem("selectedLocation", event.target.value as string);
    // setSearchParams({ location: event.target.value as string });
    //set search params of location
    setUserSelectlocation(event.target.value as string);
  };
  return (
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
  );
};
