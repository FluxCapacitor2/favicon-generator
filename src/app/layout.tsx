import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Favicon Generator",
  description:
    "Upload an image and get a small set of resized favicons and some copy-paste code snippets for your projects.",
  authors: [
    {
      name: "Brendan Swanson",
      url: "https://bswanson.dev",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
