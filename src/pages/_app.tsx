import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { BackOfficeContextProvider } from "@/contexts/BackofficeContext";
import { OrderContextProvider } from "@/contexts/OrderContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <BackOfficeContextProvider>
        <OrderContextProvider>
          <Component {...pageProps} />
        </OrderContextProvider>
      </BackOfficeContextProvider>
    </SessionProvider>
  );
}
