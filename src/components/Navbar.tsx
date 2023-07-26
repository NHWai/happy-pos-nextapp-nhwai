import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import RouterLink from "next/link";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import SettingsIcon from "@mui/icons-material/Settings";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Divider from "@mui/material/Divider";
import { AccountCircle } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { getLocationId } from "@/config";
import { useSession, signIn, signOut } from "next-auth/react";
import TableBarIcon from "@mui/icons-material/TableBar";

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
    { label: "Orders", icon: <ListAltIcon />, link: "" },
    { label: "Menus", icon: <LocalDiningIcon />, link: "menus" },
    {
      label: "Menu Categories",
      icon: <CategoryIcon />,
      link: "menu-categories",
    },
    { label: "Addons", icon: <LunchDiningIcon />, link: "addons" },
    {
      label: "Addon Categories",
      icon: <ClassIcon />,
      link: "addon-categories",
    },
    {
      label: "Locations",
      icon: <LocationOnIcon />,
      link: "locations",
    },
    {
      label: "Tables",
      icon: <TableBarIcon />,
      link: "tables",
    },
    { label: "Setting", icon: <SettingsIcon />, link: "setting" },
  ];
  const pageLabel =
    drawerItems[drawerItems.findIndex((el) => el.link === pathname.slice(1))]
      ?.label || "HappyPos";

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
                <ListItemText primary={item.label} />
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
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };
  return (
    <Box sx={{ backgroundColor: "primary" }}>
      <AppBar color="primary" position="static" sx={{ width: "100%" }}>
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
