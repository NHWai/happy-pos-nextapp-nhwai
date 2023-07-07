import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Toolbar } from "@mui/material";

export default function OrderAppNavbar() {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "primary" }}>
      <AppBar color="primary" position="static">
        <Toolbar>
          <Typography variant="h6">Happy Pos Restaurant</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
