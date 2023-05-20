import React from "react";
import { Box, Typography } from "@mui/material";
import { MainLayout } from "../components/MainLayout";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

const Logout = () => {
  const router = useRouter();

  React.useEffect(() => {
    setTimeout(() => router.push("/login"), 1000 * 10);
  }, []);

  return (
    <MainLayout>
      <Navbar />
      <Box sx={{ paddingX: "1.5rem" }}>
        {/* login page outlet starts here */}
        <Typography mt={3} variant="h3" align="center">
          You're logged out!!
        </Typography>
      </Box>
    </MainLayout>
  );
};

export default Logout;
