import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp, beautiful bakery SVG with chef hat, bread & whisk in warm golden-amber colors
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="50%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#c2410c" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#7c2d12" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  
  <!-- Subtle background glow -->
  <circle cx="256" cy="256" r="180" fill="#ffedd5" opacity="0.12"/>
  
  <g filter="url(#shadow)">
    <!-- Chef Hat Base -->
    <path d="M190 280 L322 280 L314 340 L198 340 Z" fill="#ffffff" />
    <!-- Hat band ribbon -->
    <rect x="194" y="320" width="124" height="14" rx="4" fill="#fb923c" />
    
    <!-- Chef Hat Puffs -->
    <!-- Center top -->
    <circle cx="256" cy="180" r="76" fill="#ffffff" />
    <!-- Left puff -->
    <circle cx="190" cy="220" r="64" fill="#ffffff" />
    <!-- Right puff -->
    <circle cx="322" cy="220" r="64" fill="#ffffff" />
    <!-- Center overlap filler -->
    <path d="M160 250 Q256 190 352 250 L322 285 L190 285 Z" fill="#ffffff"/>
    
    <!-- Croissant / Bread icon accent on the hat band -->
    <path d="M236 327 Q256 321 276 327 Q270 333 256 333 Q242 333 236 327 Z" fill="#ffffff"/>

    <!-- Crossing Rolling Pin & Whisk at bottom -->
    <g transform="translate(0, 40)">
      <!-- Rolling Pin handle and body -->
      <line x1="140" y1="365" x2="372" y2="365" stroke="url(#gold)" stroke-width="18" stroke-linecap="round" />
      <rect x="190" y="352" width="132" height="26" rx="10" fill="#fed7aa" stroke="#f97316" stroke-width="3"/>
    </g>
  </g>
  
  <!-- Sparkles / warmth stars -->
  <path d="M130 140 L135 152 L147 157 L135 162 L130 174 L125 162 L113 157 L125 152 Z" fill="#fef08a"/>
  <path d="M380 130 L383 140 L393 143 L383 147 L380 157 L377 147 L367 143 L377 140 Z" fill="#fef08a"/>
</svg>`;

// Maskable icon with safe zone margins (15% padding on all sides)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#9a3412" />
    </linearGradient>
    <linearGradient id="goldMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <!-- Full bleed for maskable -->
  <rect width="512" height="512" fill="url(#bgMask)"/>
  <circle cx="256" cy="256" r="190" fill="#fff" opacity="0.1" />

  <!-- Centered content scaled into safe 70% zone -->
  <g transform="translate(77, 77) scale(0.70)">
    <!-- Chef Hat Base -->
    <path d="M190 280 L322 280 L314 340 L198 340 Z" fill="#ffffff" />
    <rect x="194" y="320" width="124" height="14" rx="4" fill="#fb923c" />
    
    <circle cx="256" cy="180" r="76" fill="#ffffff" />
    <circle cx="190" cy="220" r="64" fill="#ffffff" />
    <circle cx="322" cy="220" r="64" fill="#ffffff" />
    <path d="M160 250 Q256 190 352 250 L322 285 L190 285 Z" fill="#ffffff"/>
    
    <g transform="translate(0, 40)">
      <line x1="140" y1="365" x2="372" y2="365" stroke="url(#goldMask)" stroke-width="18" stroke-linecap="round" />
      <rect x="190" y="352" width="132" height="26" rx="10" fill="#fed7aa" stroke="#f97316" stroke-width="3"/>
    </g>
  </g>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), standardSvg);

  const stdBuffer = Buffer.from(standardSvg);
  const maskBuffer = Buffer.from(maskableSvg);

  // 192x192
  await sharp(stdBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 512x512
  await sharp(stdBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // maskable 512x512
  await sharp(maskBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // apple-touch-icon 180x180
  await sharp(stdBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // favicon 48x48 png
  await sharp(stdBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'favicon.png'));
  console.log('Icons generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
