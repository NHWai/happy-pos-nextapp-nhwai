import BackOfficeContext from "@/contexts/BackofficeContext";
import { Box, TextField, Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

const Company = () => {
  const { fetchCompany, company } = useContext(BackOfficeContext);

  const [companyName, setCompanyName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCompany(companyName);
  };

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
          <Button size="small" type="submit" variant="contained">
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
    </>
  );
};

export default Company;
