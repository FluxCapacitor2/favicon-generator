"use client";

import { formatFileSize } from "@/utils";
import { useState } from "react";

export const UploadForm = () => {
  const [loading, setLoading] = useState(false);
  const [url, setURL] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);

  return (
    <form
      action="/create"
      method="POST"
      encType="multipart/form-data"
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          setLoading(true);

          const formData = new FormData(e.currentTarget);
          const response = await fetch("/create", {
            method: "POST",
            body: formData,
          });

          const buffer = await response.arrayBuffer();
          const blob = new Blob([buffer], {
            type: "application/zip",
          });
          const url = URL.createObjectURL(blob);
          setFileSize(blob.size);
          setURL(url);
        } finally {
          setLoading(false);
        }
      }}
    >
      <input
        type="file"
        name="file"
        className="my-4"
        accept="image/*"
        required
        onChange={() => setURL(null)}
      />
      <div>
        {url ? (
          <a href={url} download="favicons.zip" className="no-underline">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 flex items-center justify-center gap-2 rounded-md font-medium transition-colors"
            >
              Download{" "}
              <span className="text-gray-300">
                ({formatFileSize(fileSize)})
              </span>
            </button>
          </a>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 flex items-center justify-center gap-2 rounded-md font-medium transition-colors"
          >
            {loading && (
              <div className="h-4 w-4 border-b-2 border-b-white rounded-full animate-spin" />
            )}
            Generate Favicons
          </button>
        )}
      </div>
      <small>
        Maximum file size: 4.5 MB. Uploaded images are sent to the server but
        only stored in memory to process your request.
      </small>
    </form>
  );
};
