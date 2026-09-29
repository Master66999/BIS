function getBackendUrl() {
  let url = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "").trim();
  // Strip enclosing quotes if user entered them in Vercel UI
  url = url.replace(/^['"]|['"]$/g, "").trim();
  if (!url) {
    return "https://bis-production-fd54.up.railway.app";
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, "");
}

const BACKEND_URL = getBackendUrl();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
