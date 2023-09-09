import { MainLayout } from "@/components/MainLayout";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { RevealList } from "next-reveal";
import Image from "next/image";
import RouterLink from "next/link";
import mypic from "../assets/logo-no-background.png";
import AddressItem from "@/components/AddressItem";

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
        <Image
          src={mypic}
          alt="Picture of the author"
          width={100}
          height={100}
        />
        <Typography
          fontSize={{ xs: "2.125rem", sm: "3rem" }}
          sx={{
            // marginTop: "5rem",
            marginBottom: "2.5rem",
            width: "100%",
            textAlign: "center",
          }}
          fontWeight={"bold"}
          color="primary.dark"
        >
          Food4Life
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
            color="secondary.light"
          >
            Manage your menu catalogue easily with Food4Life POS and entice your
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
            marginBottom: "3rem",
          }}
        >
          <Typography
            fontSize={{ xs: "1.5rem", sm: "2.125rem" }}
            color="primary.dark"
          >
            Services We Provide
          </Typography>

          <RevealList
            interval={200}
            origin="bottom"
            delay={100}
            duration={1000}
            className="services"
          >
            <Stack
              sx={{ maxWidth: "200px" }}
              alignItems={"center"}
              fontSize={"2.8rem"}
              gap="0.5rem"
            >
              <MenuBookIcon fontSize="inherit" color="primary" />
              <Typography
                textAlign={"center"}
                variant="body2"
                color="secondary.light"
              >
                Easily manage your menus with Foodie POS{" "}
              </Typography>
            </Stack>
            <Stack
              sx={{ maxWidth: "200px" }}
              alignItems={"center"}
              fontSize={"2.8rem"}
              gap="0.5rem"
            >
              <QrCode2Icon fontSize="inherit" color="primary" />
              <Typography
                textAlign={"center"}
                variant="body2"
                color="secondary.light"
              >
                Scan and Order. Quick and Easy. Your customers will love it.
              </Typography>
            </Stack>
            <Stack
              sx={{ maxWidth: "200px" }}
              alignItems={"center"}
              fontSize={"2.8rem"}
              gap="0.5rem"
            >
              <AddLocationAltIcon fontSize="inherit" color="primary" />
              <Typography
                textAlign={"center"}
                variant="body2"
                color="secondary.light"
              >
                Happy POS supports multiple locations for your bussiness.
              </Typography>
            </Stack>
            <Stack
              sx={{ maxWidth: "200px" }}
              alignItems={"center"}
              fontSize={"2.8rem"}
              gap="0.5rem"
            >
              <CardMembershipIcon fontSize="inherit" color="primary" />
              <Typography
                textAlign={"center"}
                variant="body2"
                color="secondary.light"
              >
                Backoffice and Order App are included in every subscription.
              </Typography>
            </Stack>
            <Stack
              sx={{ maxWidth: "200px" }}
              alignItems={"center"}
              fontSize={"2.8rem"}
              gap="0.5rem"
            >
              <SupportAgentIcon fontSize="inherit" color="primary" />
              <Typography
                textAlign={"center"}
                variant="body2"
                color="secondary.light"
              >
                Dedicated customer support so that we are always here to help
                you.
              </Typography>
            </Stack>
          </RevealList>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "secondary.light",
          color: "#f6f4eb",
          paddingBottom: 5,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <AddressItem title={"CountryA"}>
              <div>Street Address</div>
              <div>Contact Name</div>
              <p>+44 800 400 0000</p>
              <p>blahblahblah@gmail.com</p>
            </AddressItem>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AddressItem title={"CountryB"}>
              <div>Street Address</div>
              <div>Contact Name</div>
              <p>+44 800 400 0000</p>
              <p>blahblahblah@gmail.com</p>
            </AddressItem>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AddressItem title={"About Us"}>
              <Typography variant="body2" sx={{ marginBottom: "0.5rem" }}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id
                officia excepturi dolore minus incidunt pariatur, ab ratione
                unde architecto dicta.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  cursor: "pointer",
                }}
              >
                <TwitterIcon />
                <FacebookIcon />
                <InstagramIcon />
                <LinkedInIcon />
              </Box>
            </AddressItem>
          </Grid>
        </Grid>
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
