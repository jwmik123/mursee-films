import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  experimental: {
    video: {
      providers: ["mux"],
    },
  },
};

export default withNextVideo(nextConfig);
