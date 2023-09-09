import { formatFileSize } from "@/utils";
import JSZip from "jszip";
import { FormEvent, useRef, useState } from "react";
import { Button } from "./Button";

export type FaviconInfo = {
  hasSVG: boolean;
  downloadLink: string;
  fileSize: number;
  /**
   * A map of icon file names to their base64 data URLs
   */
  entries: Record<string, string>;
};

function getMimeType(fileName: string) {
  const ext = fileName.substring(fileName.lastIndexOf(".") + 1);

  if (ext === "svg") return "image/svg+xml";
  if (ext === "ico") return "image/x-icon";

  return "image/" + ext;
}

export const UploadForm = ({
  onCompleted,
}: {
  onCompleted: (arg0: FaviconInfo) => void;
}) => {
  // Whether an icon has been created during the current session
  const [completed, setCompleted] = useState(false);
  // Whether we're waiting for a response
  const [loading, setLoading] = useState(false);

  // Form fields
  const [appleIconPadding, setAppleIconPadding] = useState(false);
  const [appleIconDefaultBackground, setAppleIconDefaultBackground] =
    useState(false);
  const [background, setBackground] = useState<string | undefined>(undefined);

  const [data, setData] = useState<FaviconInfo | null>(null);

  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      const response = await fetch("/create", {
        method: "POST",
        body: formData,
      });

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], {
        type: "application/zip",
      });

      const zip = await new JSZip().loadAsync(buffer);
      let items: Record<string, string> = {};
      for (const file of Object.keys(zip.files)) {
        items[file] =
          "data:" +
          getMimeType(zip.files[file].name) +
          ";base64," +
          (await zip.files[file].async("base64"));
      }

      const url = URL.createObjectURL(blob);

      const data = {
        hasSVG: file.type === "image/svg+xml",
        downloadLink: url,
        fileSize: blob.size,
        entries: items,
      };
      setCompleted(true);
      onCompleted(data);
      setData(data);

      setTimeout(
        () => headingRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        action="/create"
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col gap-8 border rounded-md p-4"
        onSubmit={submit}
      >
        <label>
          <p className="my-0 font-medium">Upload Base Image</p>
          <input
            type="file"
            name="file"
            className="flex-1 w-full border rounded-md p-2"
            accept="image/*"
            required
          />
          <p className="text-sm mb-0 mt-1">
            Upload an SVG version of your icon if you have one. It will be
            optimized for you.
          </p>
        </label>
        <label className="block">
          <p className="font-medium my-0">Add background color</p>
          <p className="text-sm mb-1 mt-0">
            Replace transparency with a custom color. Does not apply to SVGs.
          </p>
          <div className="flex items-center gap-2">
            {background === undefined ? (
              <div>
                <Button variant="primary" onClick={() => setBackground("#fff")}>
                  Add
                </Button>
              </div>
            ) : (
              <input
                type="color"
                name="background"
                value={background}
                onChange={(e) => setBackground(e.currentTarget.value)}
              />
            )}
            {background !== undefined && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setBackground(undefined)}
              >
                Clear
              </Button>
            )}
          </div>
        </label>
        <div>
          <label className="block">
            <input
              type="checkbox"
              name="appleIconPadding"
              checked={appleIconPadding}
              className="mr-1"
              onChange={(e) => setAppleIconPadding(e.currentTarget.checked)}
            />
            <span className="font-medium">
              Add padding around <code>apple-touch-icon</code>.
            </span>
            <p className="text-sm my-0">
              Makes your icon look better on Apple devices by slightly shrinking
              it relative to the size of the full icon.
            </p>
          </label>

          {appleIconPadding && (
            <>
              <label className="block mt-2 border-l-2 pl-4">
                <input
                  type="checkbox"
                  name="appleIconDefaultBackground"
                  checked={appleIconDefaultBackground}
                  className="mr-1"
                  onChange={(e) =>
                    setAppleIconDefaultBackground(e.currentTarget.checked)
                  }
                />
                <span className="font-medium">
                  Use automatic background color
                </span>
                <p className="text-sm my-0">
                  Extend the edges using existing colors. Works best on flat
                  images with a few rings of identical neighboring pixels on the
                  outside.
                </p>
              </label>
              {!appleIconDefaultBackground && (
                <label className="block mt-2 border-l-2 pl-4">
                  <p className="font-medium my-0">Solid background color</p>
                  <p className="text-sm mt-0 mb-1">
                    This color will be used in the padding around your icon.
                  </p>
                  <input
                    type="color"
                    defaultValue="#ffffff"
                    name="appleIconBackgroundFill"
                    className="mr-1"
                    onChange={(e) =>
                      setAppleIconDefaultBackground(e.currentTarget.checked)
                    }
                  />
                </label>
              )}
            </>
          )}
        </div>
        {completed ? (
          <Button variant="secondary" type="submit" disabled={loading}>
            {loading && (
              <div className="h-4 w-4 border-b-2 border-b-blue-950 rounded-full animate-spin" />
            )}
            Regenerate
          </Button>
        ) : (
          <Button variant="primary" type="submit" disabled={loading}>
            {loading && (
              <div className="h-4 w-4 border-b-2 border-b-white rounded-full animate-spin" />
            )}
            Generate Favicons
          </Button>
        )}
      </form>
      {data !== null && (
        <>
          <hr />

          <h2
            ref={headingRef}
            className="flex justify-between items-center pt-4"
          >
            Generated Icons
            <a
              href={data.downloadLink}
              download="favicons.zip"
              className="no-underline text-base"
            >
              <Button>
                Download{" "}
                <span className="text-gray-300">
                  ({formatFileSize(data.fileSize)})
                </span>
              </Button>
            </a>
          </h2>

          <section className="w-screen -translate-x-1/2 ml-[50%] flex justify-center items-end gap-4">
            {Object.keys(data.entries)
              .filter((it) => it !== "manifest.webmanifest")
              .map((entry) => (
                <figure key={entry}>
                  <img
                    src={data.entries[entry]}
                    alt={entry}
                    className={entry === "favicon.ico" ? "w-8 h-8" : ""}
                  />
                  <figcaption>{entry}</figcaption>
                </figure>
              ))}
          </section>
        </>
      )}
    </>
  );
};
