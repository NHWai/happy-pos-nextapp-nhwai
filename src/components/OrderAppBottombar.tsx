import React from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { Toolbar } from "@mui/material";
import RouterLink from "next/link";
import { useRouter } from "next/router";

export default function OrderAppBottombar() {
  const { pathname } = useRouter();
  if (pathname === "/order/myorder") {
    return <> </>;
  }
  return (
    <AppBar
      component={RouterLink}
      href="/order/myorder"
      color="default"
      position="fixed"
      sx={{ top: "auto", bottom: 0, textDecoration: "none" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" color="primary">
          Check Your Order
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
