import { Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useEffect, useState } from "react";
import mypic from "../assets/logo-no-background.png";
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
    <AppBar color="primary" position="static" sx={{ overflow: "hidden" }}>
      <Toolbar sx={{ position: "relative" }}>
        <Box
          component={RouterLink}
          href={`/order?locationId=${locationTable.locationId}&tableId=${locationTable.tableId}`}
          sx={{ position: "absolute", left: 0, top: "-40%" }}
        >
          <Image
            src={mypic}
            alt="Picture of the author"
            width={100}
            height={100}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
