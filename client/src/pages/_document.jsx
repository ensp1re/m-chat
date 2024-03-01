import { Html, Head, Main, NextScript } from "next/document";
import { Toaster } from "react-hot-toast"


export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Toaster/>
        <Main />
        <NextScript />
        <div id="photo-picker-element">

        </div>
      </body>
    </Html>
  );
}
