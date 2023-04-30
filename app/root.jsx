import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { ToastContainer } from "react-toastify";

import mdbCssStyle from "mdb-react-ui-kit/dist/css/mdb.min.css";
import fontCssStyle from "@fortawesome/fontawesome-free/css/all.min.css";
import toastifyCssStyle from "react-toastify/dist/ReactToastify.css";

import DataStoreProvider from "~/components/DataStoreProvider.jsx";
import ApiProvider from "~/components/ApiProvider.jsx";

export const links = () => [
  {
    rel: "stylesheet",
    href: mdbCssStyle,
  },
  {
    rel: "stylesheet",
    href: fontCssStyle,
  },
  {
    rel: "stylesheet",
    href: toastifyCssStyle,
  },
];

export default function App() {
  return (
    <DataStoreProvider>
      <ApiProvider>
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1"
            />
            <Meta />
            <Links />
          </head>
          <body>
            <ToastContainer />
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </ApiProvider>
    </DataStoreProvider>
  );
}
