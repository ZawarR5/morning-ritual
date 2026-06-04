// Downloads demo data from free APIs and saves locally as JSON
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "src", "data", "demo");

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function downloadQuran() {
  console.log("Downloading Quran Arabic (Uthmani - King Fahad)...");
  const arabic = await fetchJson("https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-kingfahadquranc.min.json");
  fs.writeFileSync(path.join(OUT, "quran-ar.json"), JSON.stringify(arabic));
  console.log(`  Quran Arabic: ${arabic.length} verses`);

  console.log("Downloading Quran English (Saheeh International)...");
  const english = await fetchJson("https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-ummmuhammad.min.json");
  fs.writeFileSync(path.join(OUT, "quran-en.json"), JSON.stringify(english));
  console.log(`  Quran English: ${english.length} verses`);
}

async function downloadDuas() {
  console.log("Downloading duas categories...");
  const catsRes = await fetchJson("https://www.ummahapi.com/api/duas/categories");
  const categories = catsRes.data.categories;
  const allDuas = [];

  for (const cat of categories) {
    console.log(`  Fetching duas: ${cat.name}...`);
    const res = await fetchJson(`https://www.ummahapi.com/api/duas/category/${cat.id}`);
    const duas = res.data.duas.map(d => ({
      ...d,
      categoryName: cat.name,
      categoryDescription: cat.description,
    }));
    allDuas.push(...duas);
  }

  fs.writeFileSync(path.join(OUT, "duas.json"), JSON.stringify(allDuas));
  console.log(`  Total duas: ${allDuas.length}`);
}

async function downloadHadith() {
  console.log("Downloading hadith...");
  const hadiths = [];
  for (let i = 0; i < 100; i++) {
    const res = await fetchJson("https://www.ummahapi.com/api/hadith/random");
    const h = res.data;
    hadiths.push({
      id: h.id,
      collection: h.collection,
      collection_name: h.collection_name,
      hadithnumber: h.hadithnumber,
      arabic: h.arabic,
      english: h.english,
      grade: h.grade,
    });
  }
  fs.writeFileSync(path.join(OUT, "hadith.json"), JSON.stringify(hadiths));
  console.log(`  Hadith downloaded: ${hadiths.length}`);
}

async function main() {
  console.log("Downloading demo data...\n");
  await downloadQuran();
  console.log();
  await downloadDuas();
  console.log();
  await downloadHadith();
  console.log("\nDone! All data saved to src/data/demo/");
}

main().catch(console.error);
