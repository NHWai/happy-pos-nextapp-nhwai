import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#E86A33",
      contrastText: "#FCF9C6",
    },
    secondary: { main: "#41644A", contrastText: "#C7D36F", dark: "#263A29" },
    info: { main: "#F2E3DB" },
  },
});

export default theme;
