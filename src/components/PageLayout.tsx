import { useRouter } from "next/router";
import { MainLayout } from "./MainLayout";
import Navbar from "./Navbar";
import Box from "@mui/material/Box";
import { getAccessToken } from "@/config";

interface Props {
  children: React.ReactNode;
}

const PageLayout = ({ children }: Props) => {
  const isLoggedIn =
    getAccessToken() && Number(localStorage.getItem("exp")) > Date.now();

  const router = useRouter();
  if (typeof window !== "undefined") {
    if (isLoggedIn) {
      return (
        <MainLayout>
          <Navbar />
          <Box sx={{ paddingX: "1.5rem" }}>{children}</Box>
        </MainLayout>
      );
    } else {
      router.push("/backoffice/login");
      return <></>;
    }
  } else {
    return <></>;
  }
};

export default PageLayout;
