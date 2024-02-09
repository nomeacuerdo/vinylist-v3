import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Button from '@/components/Button';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Vinylist v3",
  description: "This is getting more complicated and opinionated each passing day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="nav">
          <Button href="/">Home</Button>
          <Button href="/wantlist">Wantlist</Button>
          <Button href={`/vinyl/1234`}>Vinyl 1234</Button>
        </nav>
        {children}
      </body>
    </html>
  );
}
