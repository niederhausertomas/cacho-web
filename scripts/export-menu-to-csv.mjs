#!/usr/bin/env node
/**
 * Exporta cartas a CSV para Google Sheets (ES / CA / EN).
 * Uso: node scripts/export-menu-to-csv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const ITEM_HEADERS = [
  "id",
  "section",
  "order",
  "name_es",
  "name_ca",
  "name_en",
  "desc_es",
  "desc_ca",
  "desc_en",
  "price",
  "price2",
  "mark",
  "active",
];

const SECTION_HEADERS = [
  "page",
  "section",
  "field",
  "text_es",
  "text_ca",
  "text_en",
];

function loadConst(name) {
  const src = fs.readFileSync(path.join(root, "menu-i18n.js"), "utf8");
  const start = src.indexOf(`const ${name} = `);
  if (start === -1) throw new Error(`No se encontró ${name} en menu-i18n.js`);
  const braceStart = src.indexOf("{", start);
  let depth = 0;
  for (let i = braceStart; i < src.length; i++) {
    if (src[i] === "{") depth++;
    if (src[i] === "}") depth--;
    if (depth === 0) {
      return new Function(`return ${src.slice(braceStart, i + 1)}`)();
    }
  }
  throw new Error(`No se pudo parsear ${name}`);
}

function escapeCsv(value) {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowToCsv(headers, row) {
  return headers.map((h) => escapeCsv(row[h])).join(",");
}

function itemText(item, part) {
  if (!item) return "";
  if (typeof item === "string") return part === "name" ? item : "";
  return item[part] || "";
}

function parseHtmlMenu(htmlPath) {
  const html = fs.readFileSync(path.join(root, htmlPath), "utf8");
  const blocks = html.split(/<section class="menu-block"/);
  const rows = [];
  let order = 0;

  for (const block of blocks.slice(1)) {
    const sectionMatch = block.match(/data-menu-section="([^"]+)"/);
    const section = sectionMatch ? sectionMatch[1] : "unknown";

    const packageMatch = block.match(
      /menu-package-price__amount">([^<]+)</
    );
    if (packageMatch) {
      order += 1;
      rows.push({
        id: `package_${section}`,
        section,
        order,
        price: packageMatch[1].trim(),
        price2: "",
        mark: "",
      });
    }

    const itemPatterns = [
      /<li class="menu-item"[^>]*>([\s\S]*?)<\/li>/g,
      /<li data-menu-item="([^"]+)"[^>]*>([^<]*)<\/li>/g,
    ];

    let m;
    const reClass = itemPatterns[0];
    while ((m = reClass.exec(block)) !== null) {
      const chunk = m[1];
      const idMatch = chunk.match(/data-menu-item="([^"]+)"/);
      if (!idMatch) continue;
      order += 1;
      const priceMatch = chunk.match(
        /<span class="menu-item__price[^"]*">([^<]*)<\/span>/g
      );
      const prices = priceMatch
        ? priceMatch.map((p) => p.replace(/<[^>]+>/g, "").trim())
        : [];
      rows.push({
        id: idMatch[1],
        section,
        order,
        price: prices[0] || "",
        price2: prices[1] || "",
        mark: chunk.includes('menu-item__mark">*</') ? "*" : "",
      });
    }

    const rePlain = itemPatterns[1];
    while ((m = rePlain.exec(block)) !== null) {
      const id = m[1];
      if (rows.some((r) => r.id === id)) continue;
      order += 1;
      rows.push({
        id,
        section,
        order,
        price: "",
        price2: "",
        mark: "",
      });
    }
  }

  return rows;
}

function enrichItemRows(rows, items) {
  return rows.map((r) => {
    const es = items.es[r.id];
    const ca = items.ca[r.id];
    const en = items.en[r.id];
    return {
      id: r.id,
      section: r.section,
      order: r.order,
      name_es: itemText(es, "name"),
      name_ca: itemText(ca, "name"),
      name_en: itemText(en, "name"),
      desc_es: itemText(es, "desc"),
      desc_ca: itemText(ca, "desc"),
      desc_en: itemText(en, "desc"),
      price: r.price,
      price2: r.price2,
      mark: r.mark,
      active: "TRUE",
    };
  });
}

function exportSections(content) {
  const pages = ["dinner", "drinks", "groups"];
  const rows = [];

  for (const page of pages) {
    const sectionKeys = new Set([
      ...Object.keys(content.es[page] || {}),
      ...Object.keys(content.ca[page] || {}),
      ...Object.keys(content.en[page] || {}),
    ]);

    for (const sectionKey of sectionKeys) {
      if (sectionKey === "subtitles") {
        const subKeys = new Set([
          ...Object.keys(content.es[page].subtitles || {}),
          ...Object.keys(content.ca[page].subtitles || {}),
          ...Object.keys(content.en[page].subtitles || {}),
        ]);
        for (const subKey of subKeys) {
          rows.push({
            page,
            section: "wine",
            field: `subtitle_${subKey}`,
            text_es: content.es[page].subtitles?.[subKey] ?? "",
            text_ca: content.ca[page].subtitles?.[subKey] ?? "",
            text_en: content.en[page].subtitles?.[subKey] ?? "",
          });
        }
        continue;
      }

      const fields = new Set([
        ...Object.keys(content.es[page][sectionKey] || {}),
        ...Object.keys(content.ca[page][sectionKey] || {}),
        ...Object.keys(content.en[page][sectionKey] || {}),
      ]);

      for (const field of fields) {
        rows.push({
          page,
          section: sectionKey,
          field,
          text_es: content.es[page][sectionKey]?.[field] ?? "",
          text_ca: content.ca[page][sectionKey]?.[field] ?? "",
          text_en: content.en[page][sectionKey]?.[field] ?? "",
        });
      }
    }
  }

  return rows;
}

function writeCsv(filename, headers, rows) {
  const outDir = path.join(root, "docs", "google-sheets");
  fs.mkdirSync(outDir, { recursive: true });
  const lines = [headers.join(","), ...rows.map((r) => rowToCsv(headers, r))];
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
  console.log(`✓ ${outPath} (${rows.length} filas)`);
}

const items = loadConst("MENU_ITEMS");
const content = loadConst("MENU_CONTENT");

writeCsv("Comidas.csv", ITEM_HEADERS, enrichItemRows(parseHtmlMenu("comidas.html"), items));
writeCsv("Bebidas.csv", ITEM_HEADERS, enrichItemRows(parseHtmlMenu("bebidas.html"), items));
writeCsv(
  "Menu-Grupos.csv",
  ITEM_HEADERS,
  enrichItemRows(parseHtmlMenu("menu-grupos.html"), items)
);
writeCsv("Secciones.csv", SECTION_HEADERS, exportSections(content));

console.log(
  "\nCada plato lleva name_* y desc_* en ES, CA y EN. Secciones.csv = títulos y notas de bloque en los 3 idiomas."
);
