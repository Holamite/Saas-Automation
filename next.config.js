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

// Use cwd so Heroku (and any env) uses the directory where `next build` runs (e.g. /workspace)
// __dirname can differ when config is loaded; cwd is the app root where node_modules/next lives
const projectRoot = path.resolve(process.cwd());

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

