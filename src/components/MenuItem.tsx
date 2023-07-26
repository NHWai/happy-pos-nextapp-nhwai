import Box from "@mui/material/Box/Box";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";

interface Props {
  name: string;
  url: string | undefined;
}

const MenuItem = ({ name, url }: Props) => (
  <Box
    sx={{
      padding: 1,
      paddingBottom: 0,
      textAlign: "center",
      boxShadow: "1px 2px 4px rgba(0,0,0,0.3)",
      borderRadius: 1,
      height: { xs: "160px", sm: "220px" },
    }}
  >
    <Box
      sx={{
        height: "85%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!url ? (
        <DinnerDiningIcon sx={{ fontSize: "80px" }} />
      ) : (
        <img
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
          src={url}
          alt="menu-item-img"
        />
      )}
    </Box>
    <Box
      sx={{
        height: "15%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {name}
    </Box>
  </Box>
);

export default MenuItem;
