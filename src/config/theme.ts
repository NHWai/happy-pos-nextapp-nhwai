import { createTheme } from "@mui/material/styles";
import { Josefin_Sans } from "next/font/google";

const josefin_Sans = Josefin_Sans({
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#E86A33",
      contrastText: "#FCF9C6",
    },
    secondary: { main: "#41644A", contrastText: "#C7D36F", dark: "#263A29" },
    info: { main: "#F2E3DB" },
  },
  typography: {
    fontSize: 16,
    fontFamily: josefin_Sans.style.fontFamily,
  },
});

export default theme;
