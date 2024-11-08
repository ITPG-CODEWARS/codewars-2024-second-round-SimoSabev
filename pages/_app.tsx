import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import "@/styles/globals.css";  // Assuming you're using Tailwind CSS

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ClerkProvider>
        <Component {...pageProps} />
      </ClerkProvider>
  );
}

export default MyApp;
