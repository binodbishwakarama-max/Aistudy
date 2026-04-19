import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

// A nice, modern vector logo for MindFlow (a brain-like connected node shape + sparkles)
const svgLogo = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>
  </defs>
  
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <g transform="translate(128, 128) scale(1.4)">
    <path d="M136 67.5C136 54.5213 125.479 44 112.5 44C108.682 44 105.074 44.9088 101.884 46.4952C99.2086 40.2458 93.0039 36 86 36C77.4098 36 70.187 41.8893 68.3297 50.147C64.9126 48.0645 60.672 46.8571 56.1429 46.8571C40.6027 46.8571 28 59.4598 28 75C28 83.176 31.4883 90.5401 37.0374 95.7335C35.3409 98.7188 34.3333 102.13 34.3333 105.778C34.3333 118.051 44.2829 128 56.5556 128C61.3533 128 65.7946 126.478 69.4187 123.905C72.6974 131.782 80.4907 137.333 89.5556 137.333C100.825 137.333 110.158 128.91 111.472 117.957C114.397 119.261 117.585 120 120.917 120C132.008 120 141 111.008 141 99.9167C141 94.6766 139 89.9048 135.748 86.29C138.831 82.5222 140.667 77.671 140.667 72.3333C140.667 69.3499 140.063 66.5056 138.966 63.9085C137.28 66.8093 134.793 69.2132 131.789 70.9204..." fill="url(#iconGrad)" />
    <!-- Replacing precise path with a simpler, cleaner minimalist mind/sparkle vector -->
    <path fill="url(#iconGrad)" d="M96 24C56.236 24 24 56.236 24 96C24 135.764 56.236 168 96 168C135.764 168 168 135.764 168 96C168 56.236 135.764 24 96 24ZM122.38 122.38L96 148.76L69.62 122.38L43.24 96L69.62 69.62L96 43.24L122.38 69.62L148.76 96L122.38 122.38Z"/>
    <circle cx="96" cy="96" r="16" fill="#1E293B" />
  </g>
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
