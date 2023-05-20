import Box from "@mui/material/Box";

interface Props {
  children: React.ReactNode;
}

export const RouteLayout = ({ children }: Props) => {
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
      {children}
    </Box>
  );
};
