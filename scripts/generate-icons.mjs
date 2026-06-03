import { createHash } from 'crypto';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(iconsDir, { recursive: true });

function createPNG(size) {
  // Minimal valid PNG: 1x1 pixel dark background with #D1FF26 center dot
  // Uses raw IDAT with filter byte 0
  const width = size;
  const height = size;
  const rawData = [];

  // Each row: filter byte (0) + RGB for each pixel (3 bytes per pixel)
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      // Dark background (#0b0b0c) with D1FF26 accent in center
      const cx = width / 2, cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const r = size * 0.35;
      if (dist < r) {
        // Gold center
        rawData.push(0xD1, 0xFF, 0x26);
      } else {
        // Dark edge
        const t = Math.min(1, (dist - r) / (size * 0.3));
        const base = Math.round(0x0b * t);
        rawData.push(base, base, base);
      }
    }
  }

  // Build PNG chunks manually
  function crc32(buf) {
    let c = 0xffffffff;
    const table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c2 = n;
      for (let k = 0; k < 8; k++) {
        c2 = (c2 & 1) ? (0xedb88320 ^ (c2 >>> 1)) : (c2 >>> 1);
      }
      table[n] = c2;
    }
    for (let i = 0; i < buf.length; i++) {
      c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeB, data]);
    const crcV = Buffer.alloc(4);
    crcV.writeUInt32BE(crc32(crcData));
    return Buffer.concat([len, typeB, data, crcV]);
  }

  // Raw RGB data with filter bytes
  const zlib = await import('zlib');
  const rawBuf = Buffer.from(rawData);
  const compressed = zlib.deflateSync(rawBuf);

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT
  const idat = compressed;

  // IEND
  const iend = Buffer.alloc(0);

  const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', iend),
  ]);

  return png;
}

const sizes = [192, 512];
for (const size of sizes) {
  const png = createPNG(size);
  const filePath = join(iconsDir, `icon-${size}.png`);
  writeFileSync(filePath, png);
  console.log(`Created ${filePath} (${png.length} bytes)`);
}
