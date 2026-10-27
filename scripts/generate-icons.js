// scripts/generate-icons.js    (run: npm run icons)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, '..', 'assets');
fs.mkdirSync(path.join(OUT, 'svg'), { recursive: true });

const MODES = {
  light: { bg: ['#6F93FF', '#3D63FF', '#1A2FC9'], glow: 0.55, lime: true, pill: [0.80, 0.24], pills: true, solid: true },
  dark:   { bg: ['#1B2A8A', '#0F1A5C', '#060A24'], glow: 0.25, lime: true, pill: [0.65, 0.18], pills: true, solid: true },
  tinted: { bg: ['#000000', '#000000', '#000000'], glow: 0,    lime: false, pill: [0.95, 0.60], pills: true, solid: true },
  fg:     { bg: ['#000000', '#000000', '#000000'], glow: 0,    lime: true, pill: [0.80, 0.24], pills: true, solid: false, scale: 0.70 },
  mono:   { bg: ['#000000', '#000000', '#000000'], glow: 0,    lime: false, pill: [1.00, 0.85], pills: true, solid: false, scale: 0.70 },
  bgonly: { bg: ['#6F93FF', '#3D63FF', '#1A2FC9'], glow: 0.55, lime: false, pill: [0, 0],       pills: false, solid: true },
};

function build(m) {
  const s = m.scale || 1;
  const pills = [[232, 472, 150, 300], [437, 332, 150, 440], [642, 192, 150, 580]];
  const pillSvg = pills.map(([x, y, w, h]) => `
    <rect x="${x}" y="${y + 22}" width="${w}" height="${h}" rx="75" fill="#0A1450" opacity="0.30" filter="url(#soft)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="75" fill="url(#glass)" stroke="url(#rim)" stroke-width="4"/>
    <rect x="${x + 24}" y="${y + 18}" width="${w - 48}" height="64" rx="32" fill="#fff" opacity="0.38"/>`).join('');
  const lime = m.lime ? '<circle cx="512" cy="262" r="58" fill="#E3F4A0"/>' : '';
  const bg = m.solid ? `
    <rect width="1024" height="1024" fill="url(#bg)"/>
    <rect width="1024" height="1024" fill="url(#glowL)" opacity="${m.glow}"/>
    <rect width="1024" height="1024" fill="url(#glowLime)" opacity="${m.glow}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${m.bg[0]}"/><stop offset="0.55" stop-color="${m.bg[1]}"/>
      <stop offset="1" stop-color="${m.bg[2]}"/>
    </linearGradient>
    <radialGradient id="glowL" cx="0.2" cy="0.15" r="0.7">
      <stop offset="0" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowLime" cx="0.85" cy="0.9" r="0.6">
      <stop offset="0" stop-color="#E3F4A0" stop-opacity="0.7"/><stop offset="1" stop-color="#E3F4A0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="${m.pill[0]}"/>
      <stop offset="1" stop-color="#fff" stop-opacity="${m.pill[1]}"/>
    </linearGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="1" stop-color="#fff" stop-opacity="0.2"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="20"/></filter>
  </defs>
  ${bg}
  <g transform="translate(512 512) scale(${s}) translate(-512 -512)">${m.pills ? pillSvg : ''}${lime}</g>
</svg>`;
}

async function png(name, mode, size = 1024) {
  const svg = build(MODES[mode]);
  fs.writeFileSync(path.join(OUT, 'svg', `${name}.svg`), svg);
  let img = sharp(Buffer.from(svg)).resize(size, size);
  if (MODES[mode].solid) img = img.flatten({ background: '#000000' }); // opaque, no alpha
  await img.png().toFile(path.join(OUT, `${name}.png`));
}

(async () => {
  await png('icon', 'light');
  await png('icon-dark', 'dark');
  await png('icon-tinted', 'tinted');
  await png('adaptive-foreground', 'fg');
  await png('adaptive-background', 'bgonly');
  await png('adaptive-mono', 'mono');
  await png('splash-icon', 'fg');
  await png('favicon', 'light', 48);
  console.log('Tempo icons generated in /assets');
})().catch((e) => { console.error(e); process.exit(1); });
