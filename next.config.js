// next.config.js
const isProd = process.env.NODE_ENV === 'production';

// PON AQUÍ EL NOMBRE DE TU REPO (exacto, sin barra). Ej: 'mi-web'
const repo = 'frontiers'; 

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generación estática para GitHub Pages
  output: 'export',

  // Necesario si tu web se sirve bajo /<repo>/
  basePath: isProd && repo ? `/${repo}` : '',
  assetPrefix: isProd && repo ? `/${repo}/` : '',

  images: { unoptimized: true }, // evita optimizador de imágenes (no funciona en Pages)
};

module.exports = nextConfig;
