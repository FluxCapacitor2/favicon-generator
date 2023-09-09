"use client";

import { formatFileSize } from "@/utils";
import { useState } from "react";
import { Button } from "./Button";
import { FaviconInfo, UploadForm } from "./UploadForm";

export const HomePage = () => {
  const [completed, setCompleted] = useState(false);

  const [data, setData] = useState<FaviconInfo | null>(null);

  const htmlCode = `<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">${
    data?.hasSVG
      ? '\n<link rel="icon" href="/icon.svg" type="image/svg+xml">'
      : ""
  }
<link rel="manifest" href="/manifest.webmanifest">
`;

  const nextMetadata = {
    manifest: "/manifest.webmanifest",
    icons: [
      {
        rel: "apple-touch-icon",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        url: "/favicon.ico",
        sizes: "32x32",
      },
      ...(data?.hasSVG
        ? [
            {
              rel: "icon",
              url: "/icon.svg",
              type: "image/svg+xml",
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <UploadForm
        onCompleted={(data) => {
          setData(data);
          setCompleted(true);
        }}
      />
      {completed && (
        <section className="animate-slide-in">
          <h2>Instructions</h2>
          <ol>
            <li>
              <a href={data?.downloadLink}>Download</a> and extract the
              generated icons and manifest into a folder in your project
              that&apos;s publicly accessible at the root of your site.
              <p>
                If you already have a manifest, make sure to add the two{" "}
                <code>icon</code> items to it.
              </p>
              <a
                href={data!.downloadLink}
                download="favicons.zip"
                className="no-underline"
              >
                <Button>
                  Download Icons{" "}
                  <span className="text-gray-300">
                    ({formatFileSize(data!.fileSize)})
                  </span>
                </Button>
              </a>
            </li>
            <li>
              Add the following code to your <code>&lt;head&gt;</code> element:
              <pre>
                <code>{htmlCode}</code>
              </pre>
              If you're using Next.js, you can add the following code to your
              root layout instead:
              <pre>
                <code>
                  export const metadata ={" "}
                  {JSON.stringify(nextMetadata, null, 2)};
                </code>
              </pre>
            </li>
          </ol>
        </section>
      )}
    </>
  );
};
