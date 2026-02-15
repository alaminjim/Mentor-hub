import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/:path*`,
      },
      {
        source: "/api/category/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category/:path*`,
      },
      {
        source: "/api/review/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review/:path*`,
      },
      {
        source: "/api/student/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/:path*`,
      },
    ];
  },
};

export default config;
