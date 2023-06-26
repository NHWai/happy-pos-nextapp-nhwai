import BackOfficeContext from "@/contexts/BackofficeContext";
import { MainLayout } from "./MainLayout";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
}

const PageLayout = ({ children }: Props) => {
  return (
    <MainLayout>
      <Navbar />
      {children}
    </MainLayout>
  );
};

export default PageLayout;
