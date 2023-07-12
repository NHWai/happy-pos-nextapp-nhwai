import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Toolbar } from "@mui/material";
import RouterLink from "next/link";

export default function OrderAppNavbar() {
  const [locationTable, setLocationTable] = useState({
    locationId: "",
    tableId: "",
  });
  useEffect(() => {
    const locationId = localStorage.getItem("OrderlocationId");
    const tableId = localStorage.getItem("OrdertableId");
    if (locationId && tableId) {
      setLocationTable({ locationId, tableId });
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "primary" }}>
      <AppBar color="primary" position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            component={RouterLink}
            href={`/order?locationId=${locationTable.locationId}&tableId=${locationTable.tableId}`}
            variant="h6"
            sx={{ textDecoration: "none" }}
            color="white"
          >
            Happy Pos Restaurant
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
