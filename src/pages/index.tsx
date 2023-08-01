import { MainLayout } from "@/components/MainLayout";
import { Box, Button, Stack, Typography } from "@mui/material";
import RouterLink from "next/link";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function Home() {
  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <Typography
          fontSize={{ xs: "2.125rem", sm: "3rem" }}
          sx={{ marginBottom: "2.5rem" }}
        >
          Happy POS
        </Typography>

        <Box
          sx={{
            maxWidth: "400px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          <Typography
            fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
            textAlign={"center"}
          >
            Manage your menu categlog easily with Happy POS and entice your
            customers with QR code ordering system.
          </Typography>
          <Button component={RouterLink} href="/backoffice" variant="contained">
            BackOffice App
          </Button>
          <Button
            component={RouterLink}
            href="/order?locationId=5&tableId=6"
            variant="contained"
          >
            Order App
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "900px",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <Typography fontSize={{ xs: "1.5rem", sm: "2.125rem" }}>
            Services We Provide
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Stack
              sx={{ maxWidth: "200px" }}
              alignItems={"center"}
              fontSize={"2.8rem"}
              gap="0.5rem"
            >
              <MenuBookIcon fontSize="inherit" />
              <Typography textAlign={"center"} variant="body2">
                Easily manage your menus with Foodie POS{" "}
              </Typography>
            </Stack>
            <Stack
              sx={{ maxWidth: "200px" }}
              alignItems={"center"}
              fontSize={"2.8rem"}
              gap="0.5rem"
            >
              <QrCode2Icon fontSize="inherit" />
              <Typography textAlign={"center"} variant="body2">
                Scan and Order. Quick and Easy. Your customers will love it.
              </Typography>
            </Stack>
            <Stack
              sx={{ maxWidth: "200px" }}
              alignItems={"center"}
              fontSize={"2.8rem"}
              gap="0.5rem"
            >
              <AddLocationAltIcon fontSize="inherit" />
              <Typography textAlign={"center"} variant="body2">
                Happy POS supports multiple locations for your bussiness.
              </Typography>
            </Stack>
            <Stack
              sx={{ maxWidth: "200px" }}
              alignItems={"center"}
              fontSize={"2.8rem"}
              gap="0.5rem"
            >
              <CardMembershipIcon fontSize="inherit" />
              <Typography textAlign={"center"} variant="body2">
                Backoffice and Order App are included in every subscription.
              </Typography>
            </Stack>
            <Stack sx={{ maxWidth: "200px" }} alignItems={"center"}>
              <SupportAgentIcon fontSize="large" />
              <Typography textAlign={"center"} variant="body2">
                Dedicated customer support so that we are always here to help
                you.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
