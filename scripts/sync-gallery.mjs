/**
 * Merges fixed video entries with every image in public/Gallery.
 * Run: node scripts/sync-gallery.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const galleryDir = path.join(root, "public", "Gallery");
const outFile = path.join(root, "public", "data", "gallery.json");

const videos = [
  {
    type: "video",
    src: "https://player.vimeo.com/video/829827549",
    title: "Team Practice Session",
    description: "Our team practicing with the latest BCI technology",
  },
  {
    type: "video",
    src: "https://www.youtube.com/embed/-1TdAWCGu2c",
    title: "Brain-Drone Racing Demo",
    description: "Watch our team demonstrate brain-controlled drone racing",
  },
  {
    type: "video",
    src: "https://chrissmithcrawford.com/media/cbs.mp4",
    title: "National News Coverage",
    description: "Our team featured on national television for our innovative work.",
  },
];

const imageExt = /\.(jpe?g|png|webp|gif)$/i;

function main() {
  if (!fs.existsSync(galleryDir)) {
    console.error("Missing folder:", galleryDir);
    process.exit(1);
  }

  const files = fs
    .readdirSync(galleryDir)
    .filter((f) => imageExt.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const images = files.map((f) => ({
    type: "image",
    src: `/Gallery/${f}`,
    title: "Event photo",
    description: "UA Brain Drone Race",
  }));

  const data = [...videos, ...images];
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`Wrote ${outFile} (${videos.length} videos + ${images.length} images)`);
}

main();
