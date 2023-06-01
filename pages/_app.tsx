import { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <UserProvider>
        <Head>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  );
}
