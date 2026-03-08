import type { NextConfig } from "next";

const BASE_PATH = "/LeanStreak";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: BASE_PATH,
  assetPrefix: `${BASE_PATH}/`,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

export default nextConfig;
