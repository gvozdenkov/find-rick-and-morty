import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import { Footer } from './footer';

import './tailwind.css';
import './fonts/fonts.css';

export const links: LinksFunction = () => [
  {
    rel: 'icon',
    href: '/find-rick-and-morty/favicon.svg',
    type: 'image/svg+xml',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col h-screen">
        <header className="py-10 | sm:py-15">
          <div className="container">
            <h1 className="text-4xl text-center rick-title | sm:text-6xl">
              Rick and Morty Universe
            </h1>
          </div>
        </header>
        <div className="container | grow">{children}</div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
