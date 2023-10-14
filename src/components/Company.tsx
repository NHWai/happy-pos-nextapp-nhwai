import BackOfficeContext from "@/contexts/BackofficeContext";
import { Box, TextField, Button, Typography, Snackbar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Company = () => {
  const { fetchCompany, company } = useContext(BackOfficeContext);

  const [companyName, setCompanyName] = useState("");
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (company.status === "failed") {
      setOpen(true);
    }
  }, [company.status]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCompany(companyName.trim());
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

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      {" "}
      <Box
        sx={{
          mt: 10,
        }}
      >
        <Typography variant="h6" marginBottom={"1rem"}>
          Type Your company name and Login
        </Typography>
        <Box
          component={"form"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 2,
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            sx={{ display: "block" }}
            error={!!company.error}
            variant="outlined"
            size="small"
            name="companyName"
            type="text"
            placeholder="company name"
            autoComplete="off"
            required
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <Button
            size="small"
            type="submit"
            variant="contained"
            disabled={company.status === "loading"}
          >
            Login
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: "300px",
          height: "0.3px",
          my: 2,
          backgroundColor: "black",
        }}
      />
      <Button onClick={() => fetchCompany("newOne")} variant="contained">
        Create a new one
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Invalid company name, try again!"
        action={action}
      />
    </>
  );
};

export default Company;
