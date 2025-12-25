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
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    S3_AWS_REGION: process.env.S3_AWS_REGION,
    S3_AWS_BUCKET_NAME: process.env.S3_AWS_BUCKET_NAME,
    S3_AWS_ACCESS_KEY: process.env.S3_AWS_ACCESS_KEY,
    S3_AWS_SECRET_ACCESS_KEY: process.env.S3_AWS_SECRET_ACCESS_KEY,
  },
};

export default nextConfig;
