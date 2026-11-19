import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZipArchive } from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const releaseDir = path.join(rootDir, 'release');

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

async function runPreflightChecks() {
  console.log('\n🔍 [Preflight] Auditing Chrome Web Store package in dist/...');

  // 1. Verify manifest exists
  const manifestPath = path.join(distDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('dist/manifest.json not found! Run npm run build first.');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log(`✓ Manifest loaded: ${manifest.name} (v${manifest.version})`);

  // 2. Validate manifest permissions & description
  if (manifest.manifest_version !== 3) {
    throw new Error('Manifest version must be 3.');
  }
  if (!manifest.description || manifest.description.length > 132) {
    throw new Error(
      `Manifest description too long (${manifest.description?.length} chars). Chrome Web Store requires <= 132 characters.`
    );
  }
  console.log(`✓ Manifest description: ${manifest.description.length} chars (within 132 char limit)`);

  const allowedPermissions = new Set(['storage', 'activeTab']);
  for (const p of manifest.permissions || []) {
    if (!allowedPermissions.has(p)) {
      throw new Error(`Unexpected permission '${p}'. Keep permissions strictly minimal.`);
    }
  }
  console.log('✓ Permissions strictly minimal:', manifest.permissions);

  // 3. Verify all declared icons exist
  if (!manifest.icons) {
    throw new Error('No icons declared in manifest.json.');
  }
  for (const [size, iconRelPath] of Object.entries(manifest.icons)) {
    const fullIconPath = path.join(distDir, iconRelPath);
    if (!fs.existsSync(fullIconPath)) {
      throw new Error(`Declared icon for size ${size} not found at ${fullIconPath}`);
    }
    const stats = fs.statSync(fullIconPath);
    if (stats.size === 0) {
      throw new Error(`Icon file ${iconRelPath} is 0 bytes.`);
    }
  }
  console.log('✓ All manifest icons exist and have valid file sizes');

  // 4. Scan all dist files for forbidden items (.map files, external CDN scripts)
  const distFiles = getAllFiles(distDir);
  const mapFiles = distFiles.filter((f) => f.endsWith('.map'));
  if (mapFiles.length > 0) {
    throw new Error(`Forbidden source map files detected in dist: ${mapFiles.join(', ')}`);
  }
  console.log('✓ No source map files (.map) in dist/');

  // Check for external remote script links in HTML/JS
  const remoteScriptPattern = /<script[^>]+src=["']https?:/i;
  const remoteImportPattern = /import\s*\(?["']https?:/i;
  const cdnPattern = /(cdnjs\.cloudflare\.com|unpkg\.com|jsdelivr\.net)/i;

  for (const file of distFiles) {
    if (file.endsWith('.js') || file.endsWith('.html')) {
      const content = fs.readFileSync(file, 'utf-8');
      if (remoteScriptPattern.test(content) || remoteImportPattern.test(content) || cdnPattern.test(content)) {
        throw new Error(`Potential remote script or CDN link detected in ${path.relative(distDir, file)}`);
      }
    }
  }
  console.log('✓ Zero remote code execution / CDN references detected');

  return manifest.version;
}

async function createReleaseZip(version) {
  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true });
  }

  const zipFilename = `filefit-v${version}.zip`;
  const zipPath = path.join(releaseDir, zipFilename);

  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  console.log(`\n📦 [Packaging] Creating ${zipFilename}...`);

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = new ZipArchive({
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', () => {
      const bytes = archive.pointer();
      resolve({ zipPath, zipFilename, bytes });
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archive warning:', err);
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => reject(err));

    archive.pipe(output);

    // Place files at root of zip archive (NOT nested in dist/ folder)
    archive.directory(distDir, false);

    archive.finalize();
  });
}

async function main() {
  try {
    const version = await runPreflightChecks();
    const { zipPath, zipFilename, bytes } = await createReleaseZip(version);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🎉 CHROME WEB STORE RELEASE PACKAGE READY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`File:     ${zipFilename}`);
    console.log(`Path:     ${zipPath}`);
    console.log(`Size:     ${formatBytes(bytes)} (${bytes} bytes)`);
    console.log('Preflight: ALL 5 STORE COMPLIANCE CHECKS PASSED');
    console.log('Root:     manifest.json is positioned directly at the zip root');
    console.log('═══════════════════════════════════════════════════════════════\n');
  } catch (err) {
    console.error('\n❌ Release Packaging Failed:', err.message);
    process.exit(1);
  }
}

main();
