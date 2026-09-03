/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Custom domain zmusic-pal.zoejane.net is served from the site root (empty basePath).
  // To preview at https://<user>.github.io/zmusic-pal/ without a custom domain:
  //   NEXT_PUBLIC_BASE_PATH=/zmusic-pal npm run build
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
}

module.exports = nextConfig
