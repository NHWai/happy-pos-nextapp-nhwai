import { Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useEffect, useState } from "react";
import mypic from "../assets/logo-no-background.png";
import RouterLink from "next/link";
import { useRouter } from "next/router";

export default function OrderAppNavbar() {
  const [locationTable, setLocationTable] = useState({
    locationId: "",
    tableId: "",
  });
  const router = useRouter();
  const locationIdQueryParams = router.query.locationId as string;
  const tableIdQueryParams = router.query.tableId as string;
  useEffect(() => {
    const locationId = localStorage.getItem("OrderlocationId");
    const tableId = localStorage.getItem("OrdertableId");

    if (locationIdQueryParams && tableIdQueryParams) {
      setLocationTable({
        locationId: locationIdQueryParams,
        tableId: tableIdQueryParams,
      });
      localStorage.setItem("OrderlocationId", locationIdQueryParams);
      localStorage.setItem("OrdertableId", tableIdQueryParams);
    } else if (locationId && tableId) {
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
