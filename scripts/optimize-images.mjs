import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = path.resolve(import.meta.dirname, "..");
const imagesRoot = path.join(projectRoot, "assets", "images");

const exts = new Set([".png", ".jpg", ".jpeg"]);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
      continue;
    }
    yield fullPath;
  }
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function optimizeOne(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  if (!exts.has(ext)) return null;

  const inputStat = await fs.stat(inputPath);
  if (!inputStat.isFile()) return null;

  // Even small images add up on mobile connections, so optimize all of them.

  const outputPath =
    inputPath.slice(0, -ext.length) + ".webp";

  const outputExists = await fileExists(outputPath);
  if (outputExists) {
    const outputStat = await fs.stat(outputPath);
    if (outputStat.mtimeMs >= inputStat.mtimeMs) return null;
  }

  const image = sharp(inputPath, { failOn: "none" });

  // WebP visually-lossless-ish defaults
  const webpOptions = {
    quality: 82,
    effort: 6,
    smartSubsample: true
  };

  await image.webp(webpOptions).toFile(outputPath);

  const outputStat = await fs.stat(outputPath);
  return {
    inputPath,
    outputPath,
    inputBytes: inputStat.size,
    outputBytes: outputStat.size
  };
}

async function main() {
  const results = [];
  for await (const filePath of walk(imagesRoot)) {
    const optimized = await optimizeOne(filePath);
    if (optimized) results.push(optimized);
  }

  results.sort((a, b) => (b.inputBytes - b.outputBytes) - (a.inputBytes - a.outputBytes));

  const totalIn = results.reduce((sum, r) => sum + r.inputBytes, 0);
  const totalOut = results.reduce((sum, r) => sum + r.outputBytes, 0);

  for (const r of results.slice(0, 25)) {
    const saved = r.inputBytes - r.outputBytes;
    const pct = Math.max(0, Math.round((saved / r.inputBytes) * 100));
    console.log(
      `${path.relative(projectRoot, r.inputPath)} -> ${path.relative(projectRoot, r.outputPath)}  ` +
        `${formatBytes(r.inputBytes)} -> ${formatBytes(r.outputBytes)}  (-${pct}%)`
    );
  }

  console.log(`\nOptimized: ${results.length} images`);
  console.log(`Total: ${formatBytes(totalIn)} -> ${formatBytes(totalOut)}`);
}

await main();
