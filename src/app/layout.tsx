import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const inter = Outfit({ subsets: ["latin"] });

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
      <body className={inter.className}>
        {children}
        <footer className="text-center my-8">
          A project by{" "}
          <Link className="font-medium underline" href="https://bswanson.dev">
            <Image
              src="https://bswanson.dev/favicon.svg"
              unoptimized
              width={16}
              height={16}
              alt=""
              className="inline mr-1"
            />
            Brendan Swanson
          </Link>{" "}
          &mdash;{" "}
          <Link
            className="font-medium underline"
            href="https://github.com/FluxCapacitor2/favicon-generator"
          >
            View Source on GitHub
          </Link>
        </footer>
      </body>
    </html>
  );
}
