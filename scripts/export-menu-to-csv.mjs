#!/usr/bin/env node
/**
 * Exporta cartas a CSV para Google Sheets (ES / CA / EN).
 * Uso: node scripts/export-menu-to-csv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ITEM_GROUPS } from "./generate-menu-shells.mjs";
import { MENU_CATALOG, COFFEE_MAIN_IDS } from "./menu-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const ITEM_HEADERS = [
  "id",
  "section",
  "group",
  "order",
  "name_es",
  "name_ca",
  "name_en",
  "lead_es",
  "lead_ca",
  "lead_en",
  "desc_es",
  "desc_ca",
  "desc_en",
  "price",
  "price2",
  "mark",
  "priceLabel_es",
  "priceLabel_ca",
  "priceLabel_en",
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

function comboFieldText(items, id, part) {
  const es = items.es[id];
  const ca = items.ca[id];
  const en = items.en[id];
  if (part === "name") {
    return {
      es: itemText(es, "name"),
      ca: itemText(ca, "name"),
      en: itemText(en, "name"),
    };
  }
  if (part === "lead" || part === "priceLabel") {
    return {
      es: itemText(es, part),
      ca: itemText(ca, part),
      en: itemText(en, part),
    };
  }
  return {
    es: itemText(es, "desc"),
    ca: itemText(ca, "desc"),
    en: itemText(en, "desc"),
  };
}

function readExistingCsv(filename) {
  const p = path.join(root, "docs", "google-sheets", filename);
  if (!fs.existsSync(p)) return [];
  const lines = fs.readFileSync(p, "utf8").trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cols = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQ = !inQ;
        continue;
      }
      if (c === "," && !inQ) {
        cols.push(cur);
        cur = "";
        continue;
      }
      cur += c;
    }
    cols.push(cur);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return row;
  });
}

function parseListContainer(html, ulMatch, orderStart) {
  const rows = [];
  let order = orderStart;
  const ul = ulMatch[0];
  const section = ulMatch[1];
  const group = ulMatch[2] || "";

  const reClass = /<li class="menu-item[\s"][^>]*>([\s\S]*?)<\/li>/g;
  let m;
  while ((m = reClass.exec(ul)) !== null) {
    const chunk = m[1];
    const idMatch = chunk.match(/data-menu-item="([^"]+)"/);
    if (!idMatch) continue;
    order += 1;
    let prices = [];
    const dualMatch = chunk.match(
      /<div class="menu-item__prices">\s*<span>([^<]*)<\/span>\s*<span>([^<]*)<\/span>/
    );
    if (dualMatch) {
      prices = [dualMatch[1].trim(), dualMatch[2].trim()];
    } else {
      const priceMatch = chunk.match(
        /<span class="menu-item__price[^"]*">([^<]*)<\/span>/g
      );
      prices = priceMatch
        ? priceMatch.map((p) => p.replace(/<[^>]+>/g, "").trim())
        : [];
    }
    rows.push({
      id: idMatch[1],
      section,
      group,
      order,
      price: prices[0] || "",
      price2: prices[1] || "",
      mark: chunk.includes('menu-item__mark">*</') ? "*" : "",
    });
  }

  const rePlain = /<li data-menu-item="([^"]+)"[^>]*>([^<]*)<\/li>/g;
  while ((m = rePlain.exec(ul)) !== null) {
    const id = m[1];
    if (rows.some((r) => r.id === id)) continue;
    order += 1;
    rows.push({
      id,
      section,
      group,
      order,
      price: "",
      price2: "",
      mark: "",
    });
  }

  const reExtras = /<li>([\s\S]*?)<\/li>/g;
  while ((m = reExtras.exec(ul)) !== null) {
    const chunk = m[1];
    const idMatch = chunk.match(/data-menu-item="([^"]+)"/);
    if (!idMatch) continue;
    if (rows.some((r) => r.id === idMatch[1])) continue;
    order += 1;
    const priceMatch = chunk.match(/menu-item__price[^"]*">([^<]*)</);
    rows.push({
      id: idMatch[1],
      section,
      group,
      order,
      price: priceMatch ? priceMatch[1].trim() : "",
      price2: "",
      mark: "",
    });
  }

  return { rows, order };
}

function parseHtmlMenu(htmlPath) {
  const html = fs.readFileSync(path.join(root, htmlPath), "utf8");
  const rows = [];
  let order = 0;

  const listRe =
    /<ul class="[^"]*"[^>]*data-menu-list="([^"]+)"(?:[^>]*data-menu-group="([^"]*)")?[^>]*>([\s\S]*?)<\/ul>/g;
  let m;
  while ((m = listRe.exec(html)) !== null) {
    const result = parseListContainer(html, m, order);
    rows.push(...result.rows);
    order = result.order;
  }

  const extrasRe =
    /<ul class="[^"]*"[^>]*data-menu-extras-list="([^"]+)"(?:[^>]*data-menu-group="([^"]*)")?[^>]*>([\s\S]*?)<\/ul>/g;
  while ((m = extrasRe.exec(html)) !== null) {
    const result = parseListContainer(html, [m[0], m[1], m[2] || "extras"], order);
    rows.push(...result.rows);
    order = result.order;
  }

  const blocks = html.split(/<section class="menu-block"/);
  for (const block of blocks.slice(1)) {
    const sectionMatch = block.match(/data-menu-section="([^"]+)"/);
    const section = sectionMatch ? sectionMatch[1] : "unknown";
    const packageMatch = block.match(
      /data-package-id="([^"]+)"|menu-package-price__amount">([^<]+)</
    );
    if (packageMatch) {
      order += 1;
      const id = packageMatch[1] || `package_${section}`;
      const price = packageMatch[2] || "";
      rows.push({
        id,
        section,
        group: "",
        order,
        price: price.trim(),
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
    const mapped = ITEM_GROUPS[r.id];
    let section = mapped?.section || r.section;
    let group = mapped?.group ?? r.group ?? "";
    if (COFFEE_MAIN_IDS.includes(r.id)) {
      section = "coffee";
      group = "coffee";
    }
    const lead =
      r.id === "combo_addon"
        ? comboFieldText(items, r.id, "lead")
        : { es: r.lead_es || "", ca: r.lead_ca || "", en: r.lead_en || "" };
    const priceLabel =
      r.id === "combo_addon"
        ? comboFieldText(items, r.id, "priceLabel")
        : {
            es: r.priceLabel_es || "",
            ca: r.priceLabel_ca || "",
            en: r.priceLabel_en || "",
          };
    return {
      id: r.id,
      section,
      group,
      order: r.order,
      name_es: itemText(es, "name"),
      name_ca: itemText(ca, "name"),
      name_en: itemText(en, "name"),
      lead_es: lead.es,
      lead_ca: lead.ca,
      lead_en: lead.en,
      desc_es: itemText(es, "desc"),
      desc_ca: itemText(ca, "desc"),
      desc_en: itemText(en, "desc"),
      price: r.price,
      price2: r.price2,
      mark: r.mark,
      priceLabel_es: priceLabel.es,
      priceLabel_ca: priceLabel.ca,
      priceLabel_en: priceLabel.en,
      active: "TRUE",
    };
  });
}

function exportSections(content) {
  const pages = ["dinner", "drinks", "groups", "cachoBurgers"];
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

function catalogToRows(csvName, existingById) {
  const catalog = MENU_CATALOG[csvName];
  if (!catalog) return null;

  return catalog.map((entry, i) => {
    const prev = existingById[entry.id] || {};
    return {
      id: entry.id,
      section: entry.section,
      group: entry.group ?? "",
      order: i + 1,
      price: prev.price || entry.price || "",
      price2: prev.price2 || entry.price2 || "",
      mark: prev.mark || entry.mark || "",
    };
  });
}

function mergeCatalogWithExisting(csvName, parsed, existing) {
  const existingById = Object.fromEntries(existing.map((r) => [r.id, r]));
  const catalogRows = catalogToRows(csvName, existingById);
  if (catalogRows) return catalogRows;

  return parsed.length
    ? parsed
    : existing.map((r, i) => ({ ...r, order: r.order || i + 1 }));
}

function exportMenuFile(csvName, htmlName, items) {
  const parsed = parseHtmlMenu(htmlName);
  const existing = readExistingCsv(csvName);
  const existingById = Object.fromEntries(existing.map((r) => [r.id, r]));
  const fromCatalog = catalogToRows(csvName, existingById);

  let base;
  if (fromCatalog) {
    base = fromCatalog;
  } else {
    const hasHtmlItems = parsed.some(
      (r) => r.id && !String(r.id).startsWith("package_")
    );
    base = hasHtmlItems
      ? parsed
      : mergeCatalogWithExisting(csvName, parsed, existing);
  }
  writeCsv(csvName, ITEM_HEADERS, enrichItemRows(base, items));
}

const items = loadConst("MENU_ITEMS");
const content = loadConst("MENU_CONTENT");

exportMenuFile("Comidas.csv", "comidas.html", items);
exportMenuFile("Bebidas.csv", "bebidas.html", items);
exportMenuFile("Menu-Grupos.csv", "menu-grupos.html", items);
exportMenuFile("Cacho-Burgers.csv", "cacho-burgers.html", items);
writeCsv("Secciones.csv", SECTION_HEADERS, exportSections(content));

console.log(
  "\nCada plato lleva name_* y desc_* en ES, CA y EN. Secciones.csv = títulos y notas de bloque en los 3 idiomas."
);
