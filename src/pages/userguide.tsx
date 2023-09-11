import { MainLayout } from "@/components/MainLayout";
import UsrManualList from "@/components/UsrManualList";
import { Box, Typography, Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

export default function UserGuide() {
  const router = useRouter();
  return (
    <MainLayout>
      <Box sx={{ padding: "1rem" }}>
        <Box sx={{ textDecoration: "none" }}>
          <Button
            onClick={() => router.back()}
            color="secondary"
            startIcon={<KeyboardBackspaceIcon color="secondary" />}
          >
            Go Back
          </Button>
        </Box>
        <Typography
          variant="h5"
          color="primary.dark"
          sx={{ margin: "1rem 0 1rem" }}
        >
          User Guide
        </Typography>
        <ul style={{ marginLeft: "2rem" }}>
          <UsrManualList content="First create your account in our POS system by signing in with your Google Account." />
          <UsrManualList
            content={`Then choose CREATE A NEW ONE for a new company. If not use your company name which is the same as your google account name to login : "[your_google_acc_name] company"`}
          />
          <UsrManualList content=" First go to the Locations tab and create a new Location aka branch for your restaurant." />

          <UsrManualList content="Go to the Menu Category tab and create a new Menu Category." />
          <UsrManualList content="Go to the Addon Category tab and create a new Addon Category." />
          <UsrManualList content="Then you can create Addon, Menu item in respective tabs." />
          <UsrManualList content="Please test CRUD(Create/Read/Update/Delete) operations in all tabs." />
          <UsrManualList content="After that go to Tables tab and create a new table. If you create successfully, you will get a QR code which will take you to Order App where you can make orders" />
          <UsrManualList content="Restaurant Managers & Owners can monitor and manage the incoming orders in Order tab in BackOffice App. " />
        </ul>
        <Box
          sx={{ textDecoration: "none" }}
          component={Link}
          href="/backoffice"
        >
          <Button
            color="primary"
            endIcon={<KeyboardDoubleArrowRightIcon color="primary" />}
          >
            Go to Backoffice
          </Button>
        </Box>
      </Box>
      <svg
        className="blob-background"
        viewBox=" 0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#F2E3DB"
          d="M69.5,-24.3C75.9,-3,57,24.8,35,38.5C13,52.2,-12.2,51.8,-28.9,39.7C-45.6,27.6,-53.8,3.7,-47.6,-17.4C-41.4,-38.4,-20.7,-56.7,5.4,-58.5C31.6,-60.3,63.1,-45.5,69.5,-24.3Z"
          transform="translate(280 50)"
        />
      </svg>
      <svg
        className="blob-background"
        viewBox="90 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#F2E3DB"
          d="M46.1,-58.1C50.5,-51.2,38.5,-27.9,35.2,-11.4C31.8,5.1,37.2,14.8,36.1,24.8C35,34.7,27.5,44.9,18,47.3C8.6,49.8,-2.9,44.6,-17.1,41.7C-31.4,38.9,-48.4,38.3,-61.1,29.1C-73.7,19.9,-82,2,-79,-13.7C-76,-29.5,-61.7,-43,-46.7,-48.1C-31.6,-53.2,-15.8,-49.8,2.5,-52.8C20.8,-55.8,41.6,-65.1,46.1,-58.1Z"
          transform="translate(20 150)"
        />
      </svg>
      <svg
        className="blob-background"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#F2E3DB"
          d="M37.3,25.4C23.2,45.9,-30.6,47.3,-43.4,27.5C-56.2,7.8,-28.1,-33.1,-1.2,-33.8C25.7,-34.5,51.3,5,37.3,25.4Z"
          transform="translate(100 100)"
        />
      </svg>
    </MainLayout>
  );
}
