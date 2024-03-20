import ReactModal from 'react-modal'
import { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import TailwindCssUrl from '~/styles/tailwind.css?url'


ReactModal.setAppElement('#app')


export const links: LinksFunction = () => [
  {
    rel:'stylesheet', href: TailwindCssUrl
  }
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body id="app">
        <header>
          <Link className="heading-1" to="/">
            Pet booker
          </Link>
          <nav>
            <ul>
              <li>
                <Link to={"users/me"}>
                  My profile
                </Link>
              </li>
              <li>
                <Link to={"users"}>
                  Users
                </Link>
              </li>
              <li>
                <Link to={"pets"}>
                  Pets
                </Link>
              </li>
              <li>
                <Link to={"bookings"}>
                  Bookings
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
