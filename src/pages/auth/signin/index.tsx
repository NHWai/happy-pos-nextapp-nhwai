import PageLayout from "@/components/PageLayout";
import Button from "@mui/material/Button";
import React from "react";
import { signIn } from "next-auth/react";
import Box from "@mui/material/Box";

const SignIn = () => {
  return (
    <PageLayout>
      <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
        >
          Sign In With Google
        </Button>{" "}
      </Box>
    </PageLayout>
  );
};

export default SignIn;
