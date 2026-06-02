import AppToast from "@/components/utils/AppToast";
import "@/styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

const MeshProvider = dynamic(
  () => import("@meshsdk/react").then((mod) => mod.MeshProvider),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <Component {...pageProps} />
      <AppToast />
    </MeshProvider>
  );
}
