import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bjidogcgmawofbnescun.supabase.co",
        pathname: "/**",
        port: "",
      },
    ],
  },
};

export default nextConfig;
