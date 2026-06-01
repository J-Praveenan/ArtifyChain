import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  transpilePackages: ["@meshsdk/react", "@meshsdk/core", "@meshsdk/web3-sdk"],
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Handle node: URI scheme
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: any) => {
          resource.request = resource.request.replace(/^node:/, "");
        })
      );

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        buffer: false,
        stream: false,
        path: false,
        os: false,
        process: false,
      };
    }

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

export default nextConfig;