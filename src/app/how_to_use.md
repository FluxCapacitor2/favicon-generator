## How to Use

1. Upload your base image to create favicon images of the appropriate
   sizes. For best results, your uploaded image should be a square
   that is at least 512x512 pixels or an SVG.
2. Download and extract the generated ZIP file.
3. Place the extracted files in a location where they are accessible
   at the base URL. For example, in a Next.js project, this is the
   `public` directory.
4. Add the following code to your `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

If you're using Next.js, you can use the new
[Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
to define your icons:

```ts
export const metadata = {
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
    {
      rel: "icon",
      url: "/icon.svg",
      type: "image/svg+xml",
    },
  ],
};
```

5. If you already have a web manifest, combine it with the contents
   of the `manifest.webmanifest` in the generated ZIP file. It should
   contain the following properties:

```json
{
  "icons": [
    { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" }
  ]
}
```

6. Make sure you have an SVG icon! The code samples above reference an
   `icon.svg` file, and you should have one because they're smaller and
   therefore faster to download. If you can't make an SVG icon, remove
   the references to it in your HTML.
