import JSZip from "jszip";
import { NextRequest, NextResponse } from "next/server";
import pngToIco from "png-to-ico";
import Sharp from "sharp";
import { optimize } from "svgo";

const webManifest = {
  icons: [
    { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
    { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
  ],
};

/**
 * Creates favicon images based on the input file in four sizes:
 * - 32x32 (ico)
 * - 180x180 (apple-touch-icon, png)
 * - 192x192 (for web manifest, png)
 * - 512x512 (for web manifest, png)
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json("No file specified!", { status: 400 });
  }

  const fileArrayBuffer = await file.arrayBuffer();

  // Create a new zip archive for the files
  const zip = new JSZip();

  // Sharp is used to resize images
  const sharp = Sharp(fileArrayBuffer);

  if (formData.has("background")) {
    // Replace transparency with a background
    sharp.flatten({ background: formData.get("background")?.toString() });
  }

  // 512x512 icon-512.png
  const lg = await sharp
    .clone()
    .resize(512, 512)
    .png({ force: true })
    .toBuffer();

  // 192x192 icon-192.png
  const md = await sharp
    .clone()
    .resize(192, 192)
    .png({ force: true })
    .toBuffer();

  // 180x180 apple-touch-icon.png
  const sm = (
    formData.get("appleIconPadding")
      ? sharp
          .clone()
          .resize(140, 140)
          .extend({
            extendWith: formData.get("appleIconDefaultBackground")
              ? "copy"
              : "background",
            background: formData.get("appleIconBackgroundFill")?.toString(),
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          })
      : sharp.resize(180, 180)
  )
    .png({ force: true })
    .toBuffer();

  // 32x32 favicon.ico
  const xs = await sharp.clone().resize(32, 32).png({ force: true }).toBuffer();
  const ico = await pngToIco(xs);

  // Add entries to a zip file
  zip.file("icon-512.png", lg);
  zip.file("icon-192.png", md);
  zip.file("apple-touch-icon.png", sm);

  // If the input was an SVG, optimize it
  if (file.type === "image/svg+xml") {
    const svg = optimize(await file.text(), { multipass: true });
    zip.file("icon.svg", svg.data);
  }

  zip.file("favicon.ico", ico);
  zip.file("manifest.webmanifest", JSON.stringify(webManifest, null, 2));

  // Convert the zip file to a Buffer
  const buffer = await zip.generateAsync({
    type: "nodebuffer",
  });

  const filename =
    file.name.substring(file.name.lastIndexOf(".")) + "-favicons.zip";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
