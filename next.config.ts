import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/Home.html",
        destination: "/",
        permanent: true
      },
      {
        source: "/WhoAmI.html",
        destination: "/who-am-i",
        permanent: true
      },
      {
        source: "/Spotlights.html",
        destination: "/spotlights",
        permanent: true
      },
      {
        source: "/Let'sTalk.html",
        destination: "/lets-talk",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
