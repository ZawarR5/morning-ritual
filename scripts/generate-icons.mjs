import { PNG } from "pngjs";
import fs from "fs";
import path from "path";

const SIZES = [144, 192, 512];
const INPUT = "public/icons/icon-192.png";
const OUT_DIR = "public/icons";

function createMaskable(src, size) {
  const srcPng = PNG.sync.read(fs.readFileSync(INPUT));
  const dst = new PNG({ width: size, height: size });

  const padding = Math.round(size * 0.18);
  const innerSize = size - padding * 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      if (x < padding || x >= size - padding || y < padding || y >= size - padding) {
        dst.data[idx] = 5;
        dst.data[idx + 1] = 5;
        dst.data[idx + 2] = 5;
        dst.data[idx + 3] = 255;
      } else {
        const sx = Math.round(((x - padding) / innerSize) * srcPng.width);
        const sy = Math.round(((y - padding) / innerSize) * srcPng.height);
        const si = (Math.min(sy, srcPng.height - 1) * srcPng.width + Math.min(sx, srcPng.width - 1)) * 4;
        dst.data[idx] = srcPng.data[si];
        dst.data[idx + 1] = srcPng.data[si + 1];
        dst.data[idx + 2] = srcPng.data[si + 2];
        dst.data[idx + 3] = srcPng.data[si + 3];
      }
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, `icon-${size}.png`), PNG.sync.write(dst));
  console.log(`Generated icon-${size}.png (maskable, ${size}x${size})`);
}

for (const size of SIZES) {
  createMaskable(INPUT, size);
}
