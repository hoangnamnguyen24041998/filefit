import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const logoMarkPath = path.join(rootDir, 'src/assets/logo-mark.svg');
const logoMark16Path = path.join(rootDir, 'src/assets/logo-mark-16.svg');
const outputDir = path.join(rootDir, 'public/icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating crisp Chrome extension PNG icons...');
  
  const svg128Buffer = fs.readFileSync(logoMarkPath);
  const svg16Buffer = fs.readFileSync(logoMark16Path);

  // 16x16: Use optically simplified mark
  await sharp(svg16Buffer, { density: 300 })
    .resize(16, 16, { fit: 'contain' })
    .png()
    .toFile(path.join(outputDir, 'icon-16.png'));
  console.log('✓ public/icons/icon-16.png (16x16 optical)');

  // 32x32: High DPI toolbar icon (use 16px simplified geometry at 2x)
  await sharp(svg16Buffer, { density: 300 })
    .resize(32, 32, { fit: 'contain' })
    .png()
    .toFile(path.join(outputDir, 'icon-32.png'));
  console.log('✓ public/icons/icon-32.png (32x32 @2x)');

  // 48x48: Extensions management page
  await sharp(svg128Buffer, { density: 300 })
    .resize(48, 48, { fit: 'contain' })
    .png()
    .toFile(path.join(outputDir, 'icon-48.png'));
  console.log('✓ public/icons/icon-48.png (48x48)');

  // 128x128: Google Chrome Web Store Store Icon Guideline
  // The artwork is sized to 96x96 centered inside a 128x128 canvas (16px safe transparent padding)
  await sharp(svg128Buffer, { density: 300 })
    .resize(96, 96, { fit: 'contain' })
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(outputDir, 'icon-128.png'));
  console.log('✓ public/icons/icon-128.png (128x128 with 16px CWS safe padding)');

  console.log('All icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
