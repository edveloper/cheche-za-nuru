import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disable image optimization to fix private IP resolution issues
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "efzetksxzvpvbobrxtgj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
