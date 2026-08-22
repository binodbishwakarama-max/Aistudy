import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

// Premium Modern MindFlow Vector Icon with Safe-Zone Geometry for Maskable Icons
const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#389BFF" />
      <stop offset="50%" stop-color="#0071E3" />
      <stop offset="100%" stop-color="#0058B6" />
    </linearGradient>
    <linearGradient id="glyphGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F2F5F8" />
    </linearGradient>
    <filter id="subtleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.28" flood-color="#001E44" />
    </filter>
  </defs>
  
  <!-- Outer Rounded Container -->
  <rect width="512" height="512" rx="120" fill="url(#bgGrad)" />
  
  <!-- Subtle Inner Specular Rim Highlight -->
  <rect x="6" y="6" width="500" height="500" rx="114" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="4" />
  
  <!-- Bold Geometric 'M' Study Flow Glyph -->
  <path d="M136 376V136H188L256 250L324 136H376V376H326V232L266 332H246L186 232V376H136Z" 
        fill="url(#glyphGrad)" 
        filter="url(#subtleShadow)" />
        
  <!-- Glowing AI Intellect & Spaced Repetition Node -->
  <circle cx="392" cy="120" r="28" fill="#FFD60A" stroke="#0071E3" stroke-width="6" />
  <circle cx="392" cy="120" r="14" fill="#FFEAA7" opacity="0.8" />
</svg>`;

// Safe-zone maskable version with 15% inner padding
const svgMaskableLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#389BFF" />
      <stop offset="50%" stop-color="#0071E3" />
      <stop offset="100%" stop-color="#0058B6" />
    </linearGradient>
    <linearGradient id="glyphGradMask" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F2F5F8" />
    </linearGradient>
    <filter id="subtleShadowMask" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.28" flood-color="#001E44" />
    </filter>
  </defs>
  
  <!-- Full Bleed Background for Maskable Icon -->
  <rect width="512" height="512" fill="url(#bgGradMask)" />
  
  <!-- Scaled glyph within safe-zone circle -->
  <g transform="translate(51, 51) scale(0.8)">
    <path d="M136 376V136H188L256 250L324 136H376V376H326V232L266 332H246L186 232V376H136Z" 
          fill="url(#glyphGradMask)" 
          filter="url(#subtleShadowMask)" />
    <circle cx="392" cy="120" r="28" fill="#FFD60A" stroke="#0071E3" stroke-width="6" />
    <circle cx="392" cy="120" r="14" fill="#FFEAA7" opacity="0.8" />
  </g>
</svg>`;

const sizes = [
  { size: 192, name: 'pwa-192x192.png', isMaskable: false },
  { size: 512, name: 'pwa-512x512.png', isMaskable: false },
  { size: 512, name: 'pwa-maskable-512x512.png', isMaskable: true },
  { size: 180, name: 'apple-touch-icon.png', isMaskable: false }
];

async function generate() {
  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgLogo);
  console.log('Saved public/favicon.svg');

  const standardBuffer = Buffer.from(svgLogo);
  const maskableBuffer = Buffer.from(svgMaskableLogo);

  for (const { size, name, isMaskable } of sizes) {
    try {
      const buffer = isMaskable ? maskableBuffer : standardBuffer;
      await sharp(buffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, name));
      console.log(`Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`Failed to generate ${name}:`, error);
    }
  }
}

generate().then(() => console.log('Finished modern icon generation!'));
