import BackOfficeContext from "@/contexts/BackofficeContext";
import Box from "@mui/material/Box";
import { useContext } from "react";
import Company from "./Company";
import React from "react";
// import { setCompany, fetchApp } from "../contexts/BackofficeContext";

interface Props {
  children: React.ReactNode;
}

export const RouteLayout = ({ children }: Props) => {
  const { company } = useContext(BackOfficeContext);

  // React.useEffect(() => {
  //   const localStorageCompany = localStorage.getItem("company");
  //   if (localStorageCompany && company.id === 0) {
  //     const parsedCompany = JSON.parse(localStorageCompany);
  //     if (parsedCompany.id !== company.id) {
  //       setCompany({ ...parsedCompany });
  //       fetchApp(parsedCompany.id);
  //       console.log("fetch from frontend");
  //     }
  //   }
  // }, [company.id]);

  return (
    <Box
      sx={{
        width: "100%",
        marginX: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {company.id ? <> {children}</> : <Company />}
    </Box>
  );
};
