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
      menuSheetData = data;
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
    if (!row) return;

    const priceGroup = li.querySelector(".menu-item__prices");
    if (priceGroup) {
      const spans = priceGroup.querySelectorAll("span");
      if (spans[0] && row.price !== "" && row.price != null) {
        spans[0].textContent = formatPrice(row.price);
      }
      if (spans[1] && row.price2 !== "" && row.price2 != null) {
        spans[1].textContent = formatPrice(row.price2);
      }
    } else {
      const prices = li.querySelectorAll(".menu-item__price");
      if (prices[0] && row.price !== "" && row.price != null) {
        prices[0].textContent = formatPrice(row.price);
      }
      if (prices[1] && row.price2) prices[1].textContent = formatPrice(row.price2);
    }

    const mark = li.querySelector(".menu-item__mark");
    if (mark) mark.hidden = row.mark !== "*";
  });

  document.querySelectorAll(".menu-extras__grid li").forEach((li) => {
    const idNode = li.querySelector("[data-menu-item]");
    if (!idNode) return;
    const row = items[idNode.dataset.menuItem];
    if (!row) return;
    const priceEl = li.querySelector(".menu-item__price");
    if (priceEl && row.price !== "" && row.price != null) {
      priceEl.textContent = formatPrice(row.price);
    }
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
    if (!text) return;
    if (node.childElementCount === 0) {
      node.textContent = text;
      return;
    }
    if (node.matches(".menu-burgers-promo__price") && node.querySelector("strong")) {
      const label = node.querySelector("span, [data-menu-section]");
      if (label && label.childElementCount === 0) label.textContent = text;
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

function applyHoursFromSheet(lang) {
  if (!menuSheetData?.horarios?.length) return;

  const map = hoursByKey(menuSheetData.horarios);
  document.querySelectorAll("[data-sheet-hours]").forEach((node) => {
    const scope = (node.dataset.sheetHoursScope || "home").toLowerCase();
    const key = node.dataset.sheetHours;
    if (!key) return;
    const row = map[`${scope}::${key}`];
    if (!row) return;
    const text = pickLocalized(row, lang, "text");
    if (text) node.textContent = text;
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

function initMenuSheet() {
  if (!document.body.dataset.menuPage) return;

  try {
    sessionStorage.removeItem("cacho-menu-sheet-v2");
  } catch {
    /* caché antigua */
  }

  refreshMenuFromSheet(currentMenuLang());
}

function initHoursSheet() {
  if (!document.querySelector("[data-sheet-hours]")) return;
  refreshHoursFromSheet(currentMenuLang());
}

window.refreshHoursFromSheet = refreshHoursFromSheet;

initMenuSheet();
initHoursSheet();
