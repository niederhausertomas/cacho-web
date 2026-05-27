/**
 * Carta desde Google Sheets (ES / CA / EN).
 * Requiere menu-sheet-config.js con CACHO_MENU_SHEET_URL.
 */

const MENU_PAGE_KEYS = {
  dinner: "comidas",
  drinks: "bebidas",
  groups: "grupos",
};

const MENU_CACHE_KEY = "cacho-menu-sheet-v2";
const MENU_CACHE_MS = 5 * 60 * 1000;

let menuSheetData = null;
let menuSheetLoadPromise = null;

function menuLangSuffix(lang) {
  const code = (lang || "es").slice(0, 2);
  return ["es", "ca", "en"].includes(code) ? code : "es";
}

function currentMenuLang() {
  return menuLangSuffix(
    document.documentElement.lang ||
      document.body.dataset.lang ||
      localStorage.getItem("cacho-lang") ||
      "es"
  );
}

function formatPrice(value) {
  if (value === "" || value == null) return "";
  const n =
    typeof value === "number"
      ? value
      : parseFloat(String(value).replace(",", "."));
  if (Number.isNaN(n)) return String(value);
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
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
    if (!parsed.data || Date.now() - parsed.cachedAt > MENU_CACHE_MS) return null;
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
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Timeout cargando carta (JSONP)"));
    }, 15000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[cb];
      script.remove();
    }

    window[cb] = (data) => {
      cleanup();
      resolve(data);
    };

    script.src = `${url}${separator}callback=${cb}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("JSONP falló (¿Apps Script con soporte callback?)"));
    };

    document.head.appendChild(script);
  });
}

async function fetchMenuSheet(url) {
  try {
    const res = await fetch(url, { redirect: "follow", cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (fetchErr) {
    console.warn("[menu-sheet] fetch:", fetchErr.message, "→ probando JSONP");
    return fetchMenuSheetJsonp(url);
  }
}

function loadMenuSheetData() {
  const url = (window.CACHO_MENU_SHEET_URL || "").trim();
  if (!url) {
    console.warn("[menu-sheet] CACHO_MENU_SHEET_URL vacía en menu-sheet-config.js");
    return Promise.resolve(null);
  }

  const cached = readCache();
  if (cached) {
    menuSheetData = cached;
    return Promise.resolve(cached);
  }

  if (menuSheetLoadPromise) return menuSheetLoadPromise;

  menuSheetLoadPromise = fetchMenuSheet(url)
    .then((data) => {
      if (!data || !data.comidas) throw new Error("Respuesta inválida del script");
      menuSheetData = data;
      writeCache(data);
      console.info("[menu-sheet] Carta cargada", data.updatedAt);
      return data;
    })
    .catch((err) => {
      console.error("[menu-sheet]", err.message);
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
    const row = items[node.dataset.menuItem];
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
    const block = document.querySelector(
      `[data-menu-section="${row.section}"]`
    )?.closest(".menu-block");
    const amount = block?.querySelector(".menu-package-price__amount");
    if (amount && row.price) amount.textContent = formatPrice(row.price);
  });

  document.querySelectorAll("[data-menu-section][data-menu-field]").forEach((node) => {
    const text = sectionText(
      secciones,
      page,
      node.dataset.menuSection,
      node.dataset.menuField || "title",
      lang
    );
    if (text && node.childElementCount === 0) node.textContent = text;
  });

  document.querySelectorAll("[data-menu-sub]").forEach((node) => {
    const text = sectionText(
      secciones,
      page,
      "wine",
      `subtitle_${node.dataset.menuSub}`,
      lang
    );
    if (text) node.textContent = text;
  });
}

function refreshMenuFromSheet(lang) {
  return loadMenuSheetData().then(() => {
    applyMenuFromSheet(menuLangSuffix(lang || currentMenuLang()));
  });
}

function initMenuSheet() {
  if (!document.body.dataset.menuPage) return;

  refreshMenuFromSheet(currentMenuLang());
}

initMenuSheet();
