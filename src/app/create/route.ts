import JSZip from "jszip";
import { NextRequest, NextResponse } from "next/server";
import pngToIco from "png-to-ico";
import Sharp from "sharp";

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

  // 512x512 icon-512.png
  const lg = await sharp.resize(512, 512).png({ force: true }).toBuffer();

  // 192x192 icon-192.png
  const md = await sharp.resize(192, 192).png({ force: true }).toBuffer();

  // 180x180 apple-touch-icon.png
  const sm = await sharp.resize(180, 180).png({ force: true }).toBuffer();

  // 32x32 favicon.ico
  const xs = await sharp.resize(32, 32).png({ force: true }).toBuffer();
  const ico = await pngToIco(xs);

  // Add entries to a zip file
  zip.file("icon-512.png", lg);
  zip.file("icon-192.png", md);
  zip.file("apple-touch-icon.png", sm);
  zip.file("favicon.ico", ico);

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
