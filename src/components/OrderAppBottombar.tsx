import { Box } from "@mui/material";
import { useRouter } from "next/router";
import RouterLink from "next/link";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useEffect, useState } from "react";

export default function OrderAppBottombar() {
  const { pathname } = useRouter();

  const [tableId, setTableId] = useState("");

  useEffect(() => {
    const storedTableId = localStorage.getItem("OrdertableId");
    if (storedTableId) {
      setTableId(storedTableId);
    }
  }, []);

  // const tableId = localStorage.getItem("OrdertableId");

  if (pathname === "/order/myorder") {
    return <> </>;
  }

  return (
    <Box
      component={RouterLink}
      href={`/order/myorder/?tableId=${tableId}`}
      sx={{
        position: "absolute",
        right: "10%",
        bottom: "10%",
        backgroundColor: "info.main",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AddShoppingCartIcon color="primary" />
    </Box>
  );
}
