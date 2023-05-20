import { Box, Button, IconButton, Snackbar, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RouterLink from "next/link";
import { useState } from "react";
import { config } from "../config/config";
import { MainLayout } from "../components/MainLayout";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

const Register = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [errMsg, setErrMsg] = useState("Please Enter all input fields!!");
  const router = useRouter();

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid =
      user.name.length > 0 && user.email.length > 0 && user.password.length > 0;
    if (!isValid) return setOpen(true);

    try {
      const response = await fetch(`${config.baseurl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const data = await response.json();
        setOpen(true);
        setErrMsg(data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <MainLayout>
      <Navbar />
      <Box sx={{ paddingX: "1.5rem" }}>
        {/* Register page starts here */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            message={errMsg}
            action={action}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          />
          <Box
            component={"form"}
            onSubmit={registerUser}
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 400,
              minWidth: 400,
              mt: 5,
            }}
          >
            <TextField
              type="text"
              label="Name"
              name="name"
              value={user.name}
              variant="outlined"
              sx={{ mb: 2 }}
              onChange={handleChange}
              autoComplete="off"
            />
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              name="email"
              value={user.email}
              sx={{ mb: 2 }}
              onChange={handleChange}
              autoComplete="off"
            />
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              name="password"
              value={user.password}
              sx={{ mb: 2 }}
              onChange={handleChange}
              autoComplete="off"
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                mt: 5,
              }}
            >
              <Button variant="contained" type="submit">
                Register
              </Button>
              <Button
                component={RouterLink}
                href={"/login"}
                sx={{ mt: 1, fontSize: "12px" }}
                size={"small"}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Register;
