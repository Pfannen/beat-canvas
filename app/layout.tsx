import type { Metadata } from "next";
import local from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { concatClassNames } from "@/utils/css";

const sonata = local({
  src: [{ path: "../public/fonts/sonata.ttf" }],
  variable: "--font-sonata",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beat Canvas",
  description: "Sheet music studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={concatClassNames(sonata.variable, inter.className)}>
        {children}
      </body>
    </html>
  );
}
