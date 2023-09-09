import { HomePage } from "@/components/HomePage";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="prose dark:prose-invert flex justify-self-center flex-col px-4 py-8 rounded-md mx-auto">
      <h1 className="mb-0">Favicon Generator</h1>
      <p className="max-w-prose">
        Upload an SVG and instantly create the necessary sizes and markup for
        your project. Generated file types are based on{" "}
        <Link
          href="https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs"
          className="underline font-medium"
        >
          this article
        </Link>
        .
      </p>
      <HomePage />
    </main>
  );
}
