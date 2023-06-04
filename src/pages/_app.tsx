import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { BackOfficeContextProvider } from "@/contexts/BackofficeContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <BackOfficeContextProvider>
        <Component {...pageProps} />
      </BackOfficeContextProvider>
    </SessionProvider>
  );
}
