import BackOfficeContext from "@/contexts/BackofficeContext";
import { Box, TextField, Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const Company = () => {
  const router = useRouter();
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
            SignIn
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
