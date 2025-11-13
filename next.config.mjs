/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "gurubook.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
