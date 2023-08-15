import { AccountCircle } from "@mui/icons-material";
import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import RouterLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import mypic from "../assets/logo-no-background.png";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  let { pathname } = router;
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawerItems = [
    {
      label: "Orders",
      icon: <ListAltIcon color="primary" />,
      link: "",
    },
    {
      label: "Menus",
      icon: <LocalDiningIcon color="primary" />,
      link: "menus",
    },
    {
      label: "Menu Categories",
      icon: <CategoryIcon color="primary" />,
      link: "menu-categories",
    },
    {
      label: "Addons",
      icon: <LunchDiningIcon color="primary" />,
      link: "addons",
    },
    {
      label: "Addon Categories",
      icon: <ClassIcon color="primary" />,
      link: "addon-categories",
    },
    {
      label: "Locations",
      icon: <LocationOnIcon color="primary" />,
      link: "locations",
    },
    {
      label: "Tables",
      icon: <TableBarIcon color="primary" />,
      link: "tables",
    },
    {
      label: "Setting",
      icon: <SettingsIcon color="primary" />,
      link: "setting",
    },
  ];
  // const pageLabel =
  //   drawerItems[drawerItems.findIndex((el) => el.link === pathname.slice(1))]
  //     ?.label || "Food4Live";

  const pageLabel = (
    <>
      <Box sx={{ position: "absolute", left: 0, top: "-40%" }}>
        <Image
          src={mypic}
          alt="Picture of the author"
          width={100}
          height={100}
        />
      </Box>
    </>
  );

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsOpen(open);
    };

  const list = () => {
    return (
      <Box
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        sx={{ width: "250" }}
      >
        <List>
          {drawerItems.slice(0, 7).map((item) => (
            <ListItem key={item.label}>
              <ListItemButton
                component={RouterLink}
                href={`/backoffice/${item.link}`}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  sx={{ color: "secondary.main" }}
                  primary={item.label}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider />
          {drawerItems.slice(-1).map((item) => (
            <ListItem key={item.label}>
              <ListItemButton
                component={RouterLink}
                href={`/backoffice/${item.link}`}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  sx={{ color: "secondary.main" }}
                  primary={item.label}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };
  return (
    <Box sx={{ backgroundColor: "primary" }}>
      <AppBar
        color="primary"
        position="static"
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <Toolbar>
          {session &&
            pathname !== "/backoffice/company" &&
            pathname !== "/order" && (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>

                <Drawer
                  anchor="left"
                  open={isOpen}
                  onClose={toggleDrawer(false)}
                >
                  {list()}
                </Drawer>
              </>
            )}
          <Typography
            component={RouterLink}
            href="/backoffice"
            variant="h6"
            color="white"
            sx={{ flexGrow: 1, textDecoration: "none" }}
          >
            {session ? pageLabel : "Happy Pos Login Page"}
          </Typography>

          {pathname !== "/login" &&
            (!session ? (
              <Button
                onClick={() =>
                  signIn("google", { callbackUrl: "/backoffice/" })
                }
                color="inherit"
              >
                Sign In
              </Button>
            ) : (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      signOut();
                      localStorage.removeItem("company");
                    }}
                  >
                    SignOut
                  </MenuItem>
                </Menu>
              </div>
            ))}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
