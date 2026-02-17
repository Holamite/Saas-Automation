// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   turbopack: {
//     root: __dirname,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Resolve to absolute path so Heroku/deploy finds Next.js from project directory
    root: path.resolve(__dirname),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

