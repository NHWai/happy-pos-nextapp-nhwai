import Box from "@mui/material/Box";

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: "1280px",
        minHeight: "100vh",
        marginX: "auto",
      }}
    >
      {children}
    </Box>
  );
};
