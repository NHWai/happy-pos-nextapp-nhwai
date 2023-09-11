import { Box } from "@mui/material";
import { MainLayout } from "./MainLayout";
import Navbar from "./Navbar";
import BackOfficeContext from "@/contexts/BackofficeContext";
import { useContext } from "react";
import Company from "./Company";

interface Props {
  children: React.ReactNode;
}

const BackofficeLayout = ({ children }: Props) => {
  const { company } = useContext(BackOfficeContext);
  return (
    <MainLayout>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          maxWidth: "1080px",
          paddingX: "1.5rem",
          marginX: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "1rem",
        }}
      >
        {company.id ? <> {children}</> : <Company />}
        {/* {children} */}
      </Box>
    </MainLayout>
  );
};

export default BackofficeLayout;
