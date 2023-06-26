import { Typography } from "@mui/material";
import React, { useContext } from "react";
import PageLayout from "@/components/PageLayout";
import { RouteLayout } from "@/components/RouteLayout";

const Home = () => {
  return (
    <PageLayout>
      <RouteLayout>
        <Typography variant="h4">Home</Typography>
      </RouteLayout>
    </PageLayout>
  );
};

export default Home;
