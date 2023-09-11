import OrderLayout from "@/components/OrderLayout";
import OrderContext from "@/contexts/OrderContext";
import { Box, Button, Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import RouterLink from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import mypic from "../../assets/logo-no-background.png";
import { RevealList } from "next-reveal";

const style = {
  width: "100%",
  maxWidth: 360,
  textAlign: "center",
  marginTop: "2rem",
};

const OrderApp = () => {
  const { app, getMenusByLocationId } = useContext(OrderContext);
  const { query } = useRouter();

  useEffect(() => {
    if (query.locationId) {
      localStorage.setItem("OrderlocationId", query.locationId as string);
      localStorage.setItem("OrdertableId", query.tableId as string);
    }
    const locationId = Number(query.locationId);
    if (locationId && locationId !== app.location.id) {
      getMenusByLocationId(locationId);
    }
  }, [query.locationId]);

  useEffect(() => {
    if (app.status === "failed") alert("Failed to load data from server");
  }, [app.status]);

  return (
    <OrderLayout height={`calc(100vh - 64px)`}>
      <Box
        sx={{
          width: "90%",
          maxWidth: "300px",
          marginX: "auto",
          display: "flex",
          flexDirection: "column",
          marginTop: "1rem",
          alignItems: "center",
        }}
      >
        <Image src={mypic} alt="Picture of the author" width={80} height={80} />
        <Typography
          variant="h4"
          align="center"
          color="secondary"
          marginTop={"1rem"}
        >
          Make Your Orders Here!!
        </Typography>

        <Box sx={style}>
          {app.status === "loading" ? (
            <CircularProgress />
          ) : (
            <RevealList
              interval={300}
              origin="bottom"
              delay={100}
              duration={1000}
              className="menuCategories"
            >
              {app.menuCategories.map((el) => (
                <div key={el.name}>
                  <Button
                    component={RouterLink}
                    href={`/order/${el.name}`}
                    color="info"
                    size="medium"
                    variant="contained"
                    sx={{ width: "200px", color: "primary.main" }}
                  >
                    {el.name}
                  </Button>
                </div>
              ))}
            </RevealList>
          )}
        </Box>
      </Box>
    </OrderLayout>
  );
};

export default OrderApp;
