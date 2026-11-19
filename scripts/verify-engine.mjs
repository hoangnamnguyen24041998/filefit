import assert from 'node:assert';
import { analyzeAcceptAttribute } from '../src/features/interceptor/fileAnalyzer.ts';
import { formatBytes, getCleanJpgFilename, isHeicFile } from '../src/features/compression/compressImage.ts';

console.log('Testing FileFit Engine Utilities...');

// 1. Filename cleaning
assert.strictEqual(getCleanJpgFilename('photo.HEIC'), 'photo.jpg');
assert.strictEqual(getCleanJpgFilename('profile.photo.final.png'), 'profile.photo.final.jpg');
assert.strictEqual(getCleanJpgFilename('noextension'), 'noextension.jpg');
console.log('✓ Filename cleaning tests passed');

// 2. formatBytes
assert.strictEqual(formatBytes(0), '0 B');
assert.strictEqual(formatBytes(500), '500 B');
assert.strictEqual(formatBytes(1024), '1.0 KB');
assert.strictEqual(formatBytes(740 * 1024), '740 KB');
assert.strictEqual(formatBytes(4.82 * 1024 * 1024), '4.82 MB');
console.log('✓ formatBytes tests passed');

// 3. isHeicFile
const heicFile1 = { name: 'IMG_4092.heic', type: '' };
const heicFile2 = { name: 'IMG_4092.JPG', type: 'image/heic' };
const regularFile = { name: 'IMG_4092.png', type: 'image/png' };
assert.strictEqual(isHeicFile(heicFile1), true);
assert.strictEqual(isHeicFile(heicFile2), true);
assert.strictEqual(isHeicFile(regularFile), false);
console.log('✓ isHeicFile tests passed');

// 4. analyzeAcceptAttribute
const test1 = analyzeAcceptAttribute('image/png');
assert.strictEqual(test1.strictPngOnly, true);
assert.strictEqual(test1.isJpgAllowed, false);

const test2 = analyzeAcceptAttribute('image/*');
assert.strictEqual(test2.strictPngOnly, false);
assert.strictEqual(test2.isJpgAllowed, true);

const test3 = analyzeAcceptAttribute('image/jpeg, image/png');
assert.strictEqual(test3.strictPngOnly, false);
assert.strictEqual(test3.isJpgAllowed, true);

const test4 = analyzeAcceptAttribute(null);
assert.strictEqual(test4.strictPngOnly, false);
assert.strictEqual(test4.isJpgAllowed, true);
console.log('✓ analyzeAcceptAttribute tests passed');

console.log('All engine verification assertions passed successfully!');
