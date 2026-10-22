/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  serverExternalPackages: ['asciify-image', 'jimp'],
};

module.exports = nextConfig;
