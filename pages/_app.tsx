import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SM Challenge</title>
      </Head>

      <QueryClientProvider client={queryClient}>
        <main className="max-w-xl mx-auto px-4 py-8">
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </>
  );
}
