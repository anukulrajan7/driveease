// Regenerates favicon.ico + apple-icon.png + manifest PNG icons from src/app/icon.svg
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = await readFile(join(root, "src/app/icon.svg"));

const png = (size) =>
  sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

// Build a multi-resolution .ico that embeds PNG frames (Vista+ standard).
function buildIco(frames) {
  const count = frames.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  frames.forEach((f, i) => {
    const base = i * 16;
    dir.writeUInt8(f.size >= 256 ? 0 : f.size, base + 0); // width
    dir.writeUInt8(f.size >= 256 ? 0 : f.size, base + 1); // height
    dir.writeUInt8(0, base + 2); // palette
    dir.writeUInt8(0, base + 3); // reserved
    dir.writeUInt16LE(1, base + 4); // planes
    dir.writeUInt16LE(32, base + 6); // bpp
    dir.writeUInt32LE(f.data.length, base + 8); // size of data
    dir.writeUInt32LE(offset, base + 12); // offset
    offset += f.data.length;
  });

  return Buffer.concat([header, dir, ...frames.map((f) => f.data)]);
}

const icoSizes = [16, 32, 48];
const frames = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await png(size) }))
);
await writeFile(join(root, "src/app/favicon.ico"), buildIco(frames));

// Apple touch icon (180x180, no transparency padding needed — emblem fills frame)
await writeFile(join(root, "src/app/apple-icon.png"), await png(180));

// PWA / manifest icons
await writeFile(join(root, "public/icon-192.png"), await png(192));
await writeFile(join(root, "public/icon-512.png"), await png(512));

console.log("Generated favicon.ico, apple-icon.png, icon-192.png, icon-512.png");
