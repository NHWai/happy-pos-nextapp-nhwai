import { MainLayout } from "./MainLayout";
import Navbar from "./Navbar";
import Box from "@mui/material/Box";
import { useSession } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const PageLayout = ({ children }: Props) => {
  // const { data: session } = useSession();

  return (
    <MainLayout>
      <Navbar />
      {children}
      {/* {session ? (
        <Box sx={{ paddingX: "1.5rem" }}>{children}</Box>
      ) : (
        <h1>Please SignIn</h1>
      )} */}
    </MainLayout>
  );
};

export default PageLayout;
