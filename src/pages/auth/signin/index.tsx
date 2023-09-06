import Button from "@mui/material/Button";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Box from "@mui/material/Box";
import { MainLayout } from "@/components/MainLayout";
import Navbar from "@/components/Navbar";

const SignIn = () => {
  return (
    <MainLayout>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          marginX: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            paddingTop: 10,
          }}
        >
          <Button
            variant="contained"
            onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
          >
            SignIn With Google
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default SignIn;
