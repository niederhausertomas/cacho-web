/**
 * Carta desde Google Sheets (ES / CA / EN).
 * Requiere menu-sheet-config.js con CACHO_MENU_SHEET_URL.
 */

const MENU_PAGE_KEYS = {
  dinner: "comidas",
  drinks: "bebidas",
  groups: "grupos",
  cachoBurgers: "cachoBurgers",
};

/** Precios de paquetes cuando falta la fila en Sheets. */
const MENU_PACKAGE_DEFAULTS = Object.freeze({
  combo_addon: "4",
});

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

function sheetFetchUrl(baseUrl) {
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}_=${Date.now()}`;
}

async function fetchMenuSheet(url) {
  const requestUrl = sheetFetchUrl(url);
  try {
    const res = await fetch(requestUrl, { redirect: "follow", cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (fetchErr) {
    console.warn("[menu-sheet] fetch:", fetchErr.message, "→ probando JSONP");
    return fetchMenuSheetJsonp(requestUrl);
  }
}

function resolveMenuGroup(row) {
  const existing = row.group;
  if (existing != null && String(existing).trim() !== "") {
    return String(existing).trim();
  }
  const id = String(row.id || "");
  if (/^gr_starter/i.test(id)) return "starter";
  if (/^gr_main/i.test(id)) return "main";
  if (/^gr_dessert/i.test(id)) return "dessert";
  if (/^gr_drink/i.test(id)) return "drink";
  if (/^gr_pp(8|9|10)$/i.test(id)) return "drink";
  if (/^gr_pp(6|7)$/i.test(id)) return "dessert";
  if (/^gr_pp/i.test(id)) return "food";
  const orderKey = String(row.order ?? "").trim().toLowerCase();
  if (["starter", "main", "dessert", "drink"].includes(orderKey)) return orderKey;
  return "";
}

function normalizeMenuSheetRows(rows) {
  return (rows || []).map((row) => ({
    ...row,
    section: String(row.section || "").trim(),
    group: resolveMenuGroup(row),
  }));
}

function normalizeMenuSheetData(data) {
  if (!data) return data;
  ["comidas", "bebidas", "grupos", "cachoBurgers"].forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = normalizeMenuSheetRows(data[key]);
    }
  });
  return data;
}

function loadMenuSheetData() {
  const url = (window.CACHO_MENU_SHEET_URL || "").trim();
  if (!url) {
    console.warn("[menu-sheet] CACHO_MENU_SHEET_URL vacía en menu-sheet-config.js");
    return Promise.resolve(null);
  }

  if (menuSheetLoadPromise) return menuSheetLoadPromise;

  menuSheetLoadPromise = fetchMenuSheet(url)
    .then((data) => {
      if (!data || !data.updatedAt) throw new Error("Respuesta inválida del script");
      menuSheetData = normalizeMenuSheetData(data);
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

function resolvePackagePrice(items, pkgId) {
  const row = items?.[pkgId];
  const raw = row?.price;
  if (raw !== "" && raw != null) return raw;
  return MENU_PACKAGE_DEFAULTS[pkgId] ?? null;
}

function setPackagePriceEl(amount, pkgId, rawPrice) {
  if (rawPrice === "" || rawPrice == null) return;
  const formatted = formatPrice(rawPrice);
  amount.textContent = pkgId === "combo_addon" ? `+${formatted}` : formatted;
}

function applyMenuPackagePrices(items) {
  document.querySelectorAll("[data-package-id]").forEach((amount) => {
    const pkgId = amount.dataset.packageId;
    setPackagePriceEl(amount, pkgId, resolvePackagePrice(items, pkgId));
  });
}

function applyMenuPackageDefaults() {
  applyMenuPackagePrices(null);
}

function applyMenuFromSheet(lang) {
  if (!menuSheetData || !document.body.dataset.menuPage) return;

  const page = document.body.dataset.menuPage;
  const dataKey = MENU_PAGE_KEYS[page];
  if (!dataKey) return;

  const items = itemsById(menuSheetData[dataKey]);
  const secciones = menuSheetData.secciones || [];

  if (document.querySelector("[data-menu-list]")) {
    renderMenuListsFromSheet(lang, dataKey);
    applyKidsPromoFromSheet(lang, items);
    applyComboPromoFromSheet(lang, items);
  }

  applyMenuPackagePrices(items);

  document.querySelectorAll("[data-menu-section][data-menu-field]").forEach((node) => {
    const text = sectionText(
      secciones,
      page,
      node.dataset.menuSection,
      node.dataset.menuField || "title",
      lang
    );
    if (!text) return;
    if (node.childElementCount === 0) {
      node.textContent = text;
    }
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

function hoursLookupKey(row) {
  const scope = String(row.scope || "home").trim().toLowerCase();
  const key = String(row.key || "").trim();
  return `${scope}::${key}`;
}

function hoursByKey(rows) {
  const map = Object.create(null);
  (rows || []).forEach((row) => {
    if (row.key) map[hoursLookupKey(row)] = row;
  });
  return map;
}

function resetHoursPlaceholders() {
  document.querySelectorAll("[data-sheet-hours]").forEach((node) => {
    node.textContent = "";
    node.hidden = true;
  });
}

function applyHoursFromSheet(lang) {
  const nodes = document.querySelectorAll("[data-sheet-hours]");
  if (!nodes.length) return;

  if (!menuSheetData?.horarios?.length) {
    resetHoursPlaceholders();
    return;
  }

  const map = hoursByKey(menuSheetData.horarios);
  nodes.forEach((node) => {
    const scope = (node.dataset.sheetHoursScope || "home").toLowerCase();
    const key = node.dataset.sheetHours;
    if (!key) return;
    const row = map[`${scope}::${key}`];
    const text = row ? pickLocalized(row, lang, "text") : "";
    if (text) {
      node.textContent = text;
      node.hidden = false;
    } else {
      node.textContent = "";
      node.hidden = true;
    }
  });
}

function refreshHoursFromSheet(lang) {
  return loadMenuSheetData().then(() => {
    applyHoursFromSheet(menuLangSuffix(lang || currentMenuLang()));
  });
}

function refreshMenuFromSheet(lang) {
  const code = menuLangSuffix(lang || currentMenuLang());
  return loadMenuSheetData().then(() => {
    applyMenuFromSheet(code);
    applyHoursFromSheet(code);
  });
}

function menuSheetUrlConfigured() {
  return Boolean((window.CACHO_MENU_SHEET_URL || "").trim());
}

function setMenuSheetReadyState(ready) {
  const root = document.documentElement;
  root.classList.toggle("menu-sheet-pending", !ready);
  root.classList.toggle("menu-sheet-ready", ready);
  const loader = document.querySelector(".menu-sheet-loading");
  if (loader) loader.hidden = ready;
}

function ensureMenuSheetLoader() {
  const page = document.querySelector(".menu-doc-page .menu-page");
  if (!page || page.querySelector(".menu-sheet-loading")) return;

  const loader = document.createElement("div");
  loader.className = "menu-sheet-loading";
  loader.setAttribute("role", "status");
  loader.setAttribute("aria-live", "polite");

  const spinner = document.createElement("span");
  spinner.className = "menu-sheet-loading__spinner";
  spinner.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "menu-sheet-loading__text";
  text.dataset.i18n = "menuSheetLoading";
  text.textContent = "Cargando carta…";

  loader.append(spinner, text);

  const nav = page.querySelector(".menu-page__nav");
  if (nav) {
    nav.insertAdjacentElement("afterend", loader);
  } else {
    page.appendChild(loader);
  }
}

function resetMenuPlaceholders() {
  document
    .querySelectorAll("[data-menu-list], [data-menu-extras-list]")
    .forEach((ul) => {
      ul.innerHTML = "";
    });

  document.querySelectorAll("[data-menu-section][data-menu-field]").forEach((node) => {
    if (node.childElementCount === 0) node.textContent = "";
  });

  document.querySelectorAll("[data-menu-sub]").forEach((node) => {
    node.textContent = "";
  });

  document.querySelectorAll(
    "[data-package-id], #combo .menu-item__price, .menu-burgers-promo--kids .menu-item__price, [data-menu-item='combo_addon']"
  ).forEach((node) => {
    node.textContent = "";
  });
}

function initMenuSheet() {
  if (!document.body.dataset.menuPage) return;
  if (!menuSheetUrlConfigured()) return;

  try {
    sessionStorage.removeItem("cacho-menu-sheet-v2");
  } catch {
    /* caché antigua */
  }

  ensureMenuSheetLoader();
  setMenuSheetReadyState(false);
  resetMenuPlaceholders();

  refreshMenuFromSheet(currentMenuLang()).then(() => {
    if (!menuSheetData && typeof applyMenuContent === "function") {
      applyMenuContent(currentMenuLang(), { forceI18n: true });
    }
    setMenuSheetReadyState(true);
  });
}

function initHoursSheet() {
  if (!document.querySelector("[data-sheet-hours]")) return;
  resetHoursPlaceholders();
  refreshHoursFromSheet(currentMenuLang());
}

window.refreshHoursFromSheet = refreshHoursFromSheet;
window.refreshMenuFromSheet = refreshMenuFromSheet;

initMenuSheet();
initHoursSheet();
