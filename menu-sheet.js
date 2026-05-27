/**
 * Carta desde Google Sheets (ES / CA / EN).
 * Requiere menu-sheet-config.js con CACHO_MENU_SHEET_URL.
 */

const MENU_PAGE_KEYS = {
  dinner: "comidas",
  drinks: "bebidas",
  groups: "grupos",
};

const MENU_CACHE_KEY = "cacho-menu-sheet-v1";
const MENU_CACHE_MS = 5 * 60 * 1000;

let menuSheetData = null;
let menuSheetLoadPromise = null;

function menuLangSuffix(lang) {
  const code = (lang || "es").slice(0, 2);
  return ["es", "ca", "en"].includes(code) ? code : "es";
}

function formatPrice(value) {
  if (value === "" || value == null) return "";
  const n = typeof value === "number" ? value : parseFloat(String(value).replace(",", "."));
  if (Number.isNaN(n)) return String(value);
  const s = Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
  return s;
}

function pickLocalized(row, lang, base) {
  const code = menuLangSuffix(lang);
  const key = `${base}_${code}`;
  const value = row[key];
  if (value != null && String(value).trim() !== "") return String(value).trim();
  return row[`${base}_es`] != null ? String(row[`${base}_es`]).trim() : "";
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(MENU_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.updatedAt || Date.now() - parsed.cachedAt > MENU_CACHE_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(
      MENU_CACHE_KEY,
      JSON.stringify({ cachedAt: Date.now(), data, updatedAt: data.updatedAt })
    );
  } catch {
    /* quota */
  }
}

function fetchMenuSheetJsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = `cachoMenu_${Date.now()}`;
    const separator = url.includes("?") ? "&" : "?";
    const script = document.createElement("script");

    window[cb] = (data) => {
      resolve(data);
      delete window[cb];
      script.remove();
    };

    script.src = `${url}${separator}callback=${cb}`;
    script.onerror = () => {
      delete window[cb];
      script.remove();
      reject(new Error("No se pudo cargar la carta desde Google Sheets"));
    };

    document.head.appendChild(script);
  });
}

function loadMenuSheetData() {
  const url = (window.CACHO_MENU_SHEET_URL || "").trim();
  if (!url) return Promise.resolve(null);

  const cached = readCache();
  if (cached) {
    menuSheetData = cached;
    return Promise.resolve(cached);
  }

  if (menuSheetLoadPromise) return menuSheetLoadPromise;

  menuSheetLoadPromise = fetchMenuSheetJsonp(url)
    .then((data) => {
      menuSheetData = data;
      writeCache(data);
      return data;
    })
    .catch((err) => {
      console.warn("[menu-sheet]", err.message);
      return null;
    })
    .finally(() => {
      menuSheetLoadPromise = null;
    });

  return menuSheetLoadPromise;
}

function itemsById(rows) {
  const map = Object.create(null);
  (rows || []).forEach((row) => {
    if (row.id) map[String(row.id)] = row;
  });
  return map;
}

function sectionText(secciones, page, section, field, lang) {
  const row = (secciones || []).find(
    (s) =>
      String(s.page) === page &&
      String(s.section) === section &&
      String(s.field) === field
  );
  if (!row) return "";
  return pickLocalized(row, lang, "text");
}

function applyMenuFromSheet(lang) {
  if (!menuSheetData || !document.body.dataset.menuPage) return;

  const page = document.body.dataset.menuPage;
  const dataKey = MENU_PAGE_KEYS[page];
  if (!dataKey) return;

  const items = itemsById(menuSheetData[dataKey]);
  const secciones = menuSheetData.secciones || [];

  document.querySelectorAll("[data-menu-item]").forEach((node) => {
    const id = node.dataset.menuItem;
    const row = items[id];
    if (!row) return;

    const part = node.dataset.menuPart;
    if (part === "name" || part === "desc") {
      const text = pickLocalized(row, lang, part);
      if (text) node.textContent = text;
      return;
    }

    if (!part) {
      const name = pickLocalized(row, lang, "name");
      if (name) node.textContent = name;
    }
  });

  document.querySelectorAll(".menu-item").forEach((li) => {
    const idNode = li.querySelector("[data-menu-item]");
    if (!idNode) return;
    const row = items[idNode.dataset.menuItem];
    if (!row || row.price === "" || row.price == null) return;

    const prices = li.querySelectorAll(".menu-item__price");
    if (prices[0]) prices[0].textContent = formatPrice(row.price);
    if (prices[1] && row.price2) prices[1].textContent = formatPrice(row.price2);

    const mark = li.querySelector(".menu-item__mark");
    if (mark) mark.hidden = row.mark !== "*";
  });

  Object.keys(items).forEach((id) => {
    if (!id.startsWith("package_")) return;
    const row = items[id];
    const section = row.section;
    const block = document.querySelector(
      `[data-menu-section="${section}"]`
    )?.closest(".menu-block");
    const amount = block?.querySelector(".menu-package-price__amount");
    if (amount && row.price) amount.textContent = formatPrice(row.price);
  });

  document.querySelectorAll("[data-menu-section][data-menu-field]").forEach((node) => {
    const section = node.dataset.menuSection;
    const field = node.dataset.menuField || "title";
    const text = sectionText(secciones, page, section, field, lang);
    if (text && node.childElementCount === 0) node.textContent = text;
  });

  document.querySelectorAll("[data-menu-sub]").forEach((node) => {
    const sub = node.dataset.menuSub;
    const text = sectionText(secciones, page, "wine", `subtitle_${sub}`, lang);
    if (text) node.textContent = text;
  });
}

function initMenuSheet() {
  if (!document.body.dataset.menuPage) return;

  loadMenuSheetData().then(() => {
    const lang =
      document.documentElement.lang ||
      document.body.dataset.lang ||
      localStorage.getItem("cacho-lang") ||
      "es";
    applyMenuFromSheet(menuLangSuffix(lang));
  });
}

initMenuSheet();
