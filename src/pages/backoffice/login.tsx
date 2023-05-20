import { Box, Button, IconButton, Snackbar, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { config } from "../../config/config";
import { MainLayout } from "../../components/MainLayout";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/router";
import RouterLink from "next/link";

const Login = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [errMsg, setErrMsg] = useState("Please fill all input fields!!");

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = user.email.length > 0 && user.password.length > 0;
    if (!isValid) return setOpen(true);

    try {
      const response = await fetch(`${config.baseurl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("exp", data.expiresIn);
        router.push("/");
      } else {
        const data = await response.json();
        setOpen(true);
        setErrMsg(data.msg);
      }
    } catch (err) {
      console.log("Error here: ", err);
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
        {/* login page outlet starts here */}
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
            onSubmit={loginUser}
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 400,
              minWidth: 400,
              mt: 5,
            }}
          >
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
                Log in
              </Button>

              <Button
                component={RouterLink}
                href={"/register"}
                sx={{ mt: 1, fontSize: "12px" }}
                size={"small"}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Login;
