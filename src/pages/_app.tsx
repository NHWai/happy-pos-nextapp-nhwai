import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { BackOfficeContextProvider } from "@/contexts/BackofficeContext";
import { OrderContextProvider } from "@/contexts/OrderContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/config/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <BackOfficeContextProvider>
        <OrderContextProvider>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </OrderContextProvider>
      </BackOfficeContextProvider>
    </SessionProvider>
  );
}
