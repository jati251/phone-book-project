import type { AppProps } from "next/app";
import "@/styles/globals.css";
import AppProvider from "@/providers/app-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
