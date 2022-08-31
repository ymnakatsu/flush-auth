import type { AppProps } from "next/app";
import "../style.css";
import "../App.css";
import { RecoilRoot } from "recoil";
import { resetServerContext } from "react-beautiful-dnd";
import CSR from "../components/csr/CSR";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  resetServerContext();
  return (
    <CSR>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </CSR>
  );
}
