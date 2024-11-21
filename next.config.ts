import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/earth',  // إزالة الشريط المائل من النهاية
  assetPrefix: '/earth/',  // هذا الشريط المائل ضروري للملفات الثابتة
  trailingSlash: true,
  output: "export",
};

export default nextConfig;
