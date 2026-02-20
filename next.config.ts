import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rukminim1.flixcart.com",
      },
      {
        protocol: "https",
        hostname: "rukminim2.flixcart.com",
      },
      {
        protocol: "https",
        hostname: "static-assets-web.flixcart.com",
      },
      {
        protocol: "https",
        hostname: "*.flixcart.com",
      },
    ],
  },
};

export default nextConfig;
