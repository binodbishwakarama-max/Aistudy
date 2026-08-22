import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mindflowBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2997FF" />
      <stop offset="100%" stop-color="#0071E3" />
    </linearGradient>
    <filter id="iconShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity="0.25" flood-color="#002D62" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="116" fill="url(#mindflowBg)" />
  <path d="M128 384V128H184L256 252L328 128H384V384H328V228L268 332H244L184 228V384H128Z" fill="#FFFFFF" filter="url(#iconShadow)" />
  <circle cx="396" cy="116" r="28" fill="#FFD60A" stroke="#0071E3" stroke-width="6" />
</svg>`;

const sizes = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' }
];

async function generate() {
  const svgBuffer = Buffer.from(svgLogo);

  for (const { size, name } of sizes) {
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, name));
      console.log("Generated " + name + " (" + size + "x" + size + ")");
    } catch (error) {
      console.error("Failed to generate " + name + ":", error);
    }
  }
}

generate().then(() => console.log('Finished icon generation.'));
