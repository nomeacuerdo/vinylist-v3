import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from 'next/image';
import Logo from '@/components/Logo';
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
    <html lang="en" className="dark">
      <body className={inter.className}>
        <nav className="flex h-16 px-4 mb-2 border-b">
          <div className="flex container mx-auto items-center md:space-x-4 lg:space-x-6 p-0">
            <div className="flex items-center">
              <Logo className="fill-indigo-600 pr-1" />
              <span className="bg-gradient-to-br from-indigo-600 to-pink-500 bg-clip-text text-transparent box-decoration-clone m-0 pr-4">
                nomeacuerdo records
              </span>
            </div>
            <div className="flex items-center">
              <Button href="/">Home</Button>
              <Button href="/folders">Dealers</Button>
              <Button href="/wantlist">Wantlist</Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
