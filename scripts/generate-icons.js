// Script to generate valid PNG icons for PWA using Node.js built-in zlib
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function createPng(width, height, isMaskable = false) {
  // RGBA buffer: (width * 4 + 1 filter byte per row) * height
  const rowBytes = width * 4;
  const rawData = Buffer.alloc((rowBytes + 1) * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? width * 0.38 : width * 0.44;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep dark slate background: #0f172a (15, 23, 42)
      let r = 15;
      let g = 23;
      let b = 42;
      let a = 255;

      // Outer border circle
      if (dist >= radius - 4 && dist <= radius) {
        // Emerald border
        r = 52;
        g = 211;
        b = 153;
      } else if (dist < radius - 4) {
        // Geometric 'N' pattern inside circle
        // N vertical left line: x between cx - radius*0.5 and cx - radius*0.3, y between cy - radius*0.5 and cy + radius*0.5
        const leftCol = Math.abs(x - (cx - radius * 0.38)) < radius * 0.1;
        const rightCol = Math.abs(x - (cx + radius * 0.38)) < radius * 0.1;
        const inY = Math.abs(y - cy) < radius * 0.55;

        // Diagonal from top-left to bottom-right
        const diagProgress = (x - (cx - radius * 0.38)) / (radius * 0.76);
        const expectedY = cy - radius * 0.55 + diagProgress * (radius * 1.1);
        const onDiag = inY && Math.abs(y - expectedY) < radius * 0.12 && x >= (cx - radius * 0.38) && x <= (cx + radius * 0.38);

        if (inY && (leftCol || rightCol || onDiag)) {
          // Emerald-400 / Teal gradient
          if (onDiag) {
            r = 56;
            g = 189;
            b = 248; // Cyan accent for diagonal
          } else {
            r = 16;
            g = 185;
            b = 129; // Emerald-500
          }
        } else {
          // Slate-900 inner fill
          r = 2;
          g = 6;
          b = 23;
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // Deflate IDAT payload
  const compressed = zlib.deflateSync(rawData);

  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf, start, len) {
    let c = 0xffffffff;
    for (let i = start; i < start + len; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function writeChunk(type, data) {
    const chunkLen = data.length;
    const buf = Buffer.alloc(8 + chunkLen + 4);
    buf.writeUInt32BE(chunkLen, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crcVal = crc32(buf, 4, 4 + chunkLen);
    buf.writeUInt32BE(crcVal, 8 + chunkLen);
    return buf;
  }

  // PNG Header
  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk: width (4), height (4), bit depth (1=8), color type (1=6 RGBA), compression (1=0), filter (1=0), interlace (1=0)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // Color type 6: RGBA
  ihdrData[10] = 0; // Compression 0
  ihdrData[11] = 0; // Filter 0
  ihdrData[12] = 0; // Interlace 0
  const ihdrChunk = writeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = writeChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
}

console.log('Generating PWA icons...');
const icon192 = createPng(192, 192, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);

const icon512 = createPng(512, 512, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);

const iconMaskable = createPng(512, 512, true);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), iconMaskable);

const appleIcon = createPng(180, 180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icon192);

console.log('All PWA icons generated successfully in public/');
