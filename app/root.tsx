import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import Header from "./components/header";
import AppStateProvider from "./states/app-context";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "/bootstrap.min.css",
  },
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
    integrity:
      "sha512-5C2VMMEeqNOOHVz71wLb6+zz9RUgWU8JiN8zzUf/3SNoiQxMUCW2J0bSxL99bwD1InuZs+R5tD1Xo5GK6K15FQ==",
    crossorigin: "anonymous",
    referrerpolicy: "no-referrer",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script src="/bootstrap.bundle.min.js"></script>
      </head>
      <body>
        <AppStateProvider>
          <div className="app">
            <main>
              <div className="header container">
                <Header />
              </div>
              <div>
                <div id="detail" className="my-10">
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </AppStateProvider>
        <ScrollRestoration />
        <Scripts />
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      </body>
    </html>
  );
}
