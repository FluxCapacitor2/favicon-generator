import { UploadForm } from "@/components/UploadForm";
import { readFile } from "fs/promises";
import Image from "next/image";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

async function getMarkdown() {
  const result = await unified()
    // @ts-expect-error
    .use(remarkParse)
    // @ts-expect-error
    .use(remarkRehype)
    .use(rehypePrettyCode)
    .use(rehypeStringify)
    .process(await readFile("src/app/how_to_use.md"));

  return result;
}

export default async function Home() {
  const { value } = await getMarkdown();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen prose dark:prose-invert max-w-none">
      <div className="flex-1 flex items-center mt-8">
        <main className="flex justify-self-center flex-col p-8 rounded-md shadow-xl max-w-prose mx-auto">
          <h1 className="mb-0">Favicon Generator</h1>
          <p className="max-w-prose">
            Upload an SVG and instantly create the necessary sizes and markup
            for your project. Generated file types are based on{" "}
            <Link
              href="https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs"
              className="underline font-medium"
            >
              this article
            </Link>
            .
          </p>
          <UploadForm />
          <section dangerouslySetInnerHTML={{ __html: value }} />
        </main>
      </div>
      <div className="justify-self-end mt-auto my-2">
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
      </div>
    </div>
  );
}
