/**
 * Renderizado de listas de carta desde Google Sheets.
 * Requiere contenedores <ul data-menu-list="section" [data-menu-group="…"]>.
 */

function menuRowActive(row) {
  const v = row.active;
  if (v === false || v === "" || v == null) return true;
  return String(v).toUpperCase() !== "FALSE";
}

function menuRowOrder(row) {
  const n = parseInt(row.order, 10);
  return Number.isNaN(n) ? 0 : n;
}

function isMenuListRow(row) {
  const id = String(row.id || "");
  if (!id) return false;
  if (id.startsWith("package_")) return false;
  if (id === "combo_addon") return false;
  return true;
}

function createMenuItemElement(row, lang, options) {
  const { plain, compact } = options;
  const name = pickLocalized(row, lang, "name");
  const desc = pickLocalized(row, lang, "desc");
  const mark = row.mark === "*";
  const hasPrice2 = row.price2 !== "" && row.price2 != null;
  const hasPrice = row.price !== "" && row.price != null;
  const dual = hasPrice2;

  if (plain) {
    const li = document.createElement("li");
    li.dataset.menuItem = row.id;
    li.textContent = name;
    return li;
  }

  const li = document.createElement("li");
  li.className = "menu-item";
  if (dual) li.classList.add("menu-item--dual");
  if (compact) li.classList.add("menu-item--compact");

  const head = document.createElement("div");
  head.className = "menu-item__head";
  const h3 = document.createElement("h3");
  const nameSpan = document.createElement("span");
  nameSpan.dataset.menuItem = row.id;
  nameSpan.dataset.menuPart = "name";
  nameSpan.textContent = name;
  h3.appendChild(nameSpan);
  if (mark) {
    h3.appendChild(document.createTextNode(" "));
    const markSpan = document.createElement("span");
    markSpan.className = "menu-item__mark";
    markSpan.textContent = "*";
    h3.appendChild(markSpan);
  }
  head.appendChild(h3);

  if (dual) {
    const prices = document.createElement("div");
    prices.className = "menu-item__prices";
    const s1 = document.createElement("span");
    s1.textContent = formatPrice(row.price);
    prices.appendChild(s1);
    const s2 = document.createElement("span");
    s2.textContent = formatPrice(row.price2);
    prices.appendChild(s2);
    head.appendChild(prices);
  } else if (hasPrice) {
    const price = document.createElement("span");
    price.className = "menu-item__price";
    price.textContent = formatPrice(row.price);
    head.appendChild(price);
  }

  li.appendChild(head);

  if (desc) {
    const p = document.createElement("p");
    p.className = "menu-item__desc";
    const descSpan = document.createElement("span");
    descSpan.dataset.menuItem = row.id;
    descSpan.dataset.menuPart = "desc";
    descSpan.textContent = desc;
    p.appendChild(descSpan);
    li.appendChild(p);
  }

  return li;
}

function createExtrasGridItem(row, lang) {
  const li = document.createElement("li");
  const nameSpan = document.createElement("span");
  nameSpan.dataset.menuItem = row.id;
  nameSpan.dataset.menuPart = "name";
  nameSpan.textContent = pickLocalized(row, lang, "name");
  li.appendChild(nameSpan);
  if (row.price !== "" && row.price != null) {
    const price = document.createElement("span");
    price.className = "menu-item__price";
    price.textContent = formatPrice(row.price);
    li.appendChild(price);
  }
  return li;
}

function renderMenuListsFromSheet(lang, dataKey) {
  const rows = (menuSheetData[dataKey] || [])
    .filter(menuRowActive)
    .filter(isMenuListRow);

  document.querySelectorAll("[data-menu-list]").forEach((ul) => {
    const section = ul.dataset.menuList;
    const group = ul.dataset.menuGroup || "";
    const plain = ul.classList.contains("menu-list--plain");
    const compact =
      ul.classList.contains("menu-list--compact") ||
      ul.closest("#combinados") != null;

    const items = rows
      .filter(
        (r) =>
          String(r.section) === section && String(r.group || "") === group
      )
      .sort((a, b) => menuRowOrder(a) - menuRowOrder(b));

    ul.innerHTML = "";
    items.forEach((row) => {
      ul.appendChild(createMenuItemElement(row, lang, { plain, compact }));
    });

    const subtitle = ul.previousElementSibling;
    if (subtitle?.matches?.(".menu-subtitle[data-menu-sub]")) {
      subtitle.hidden = items.length === 0;
    }
    ul.hidden = items.length === 0;
  });

  document.querySelectorAll("[data-menu-extras-list]").forEach((ul) => {
    const section = ul.dataset.menuExtrasList;
    const group = ul.dataset.menuGroup || "extras";

    const items = rows
      .filter(
        (r) =>
          String(r.section) === section && String(r.group || "") === group
      )
      .sort((a, b) => menuRowOrder(a) - menuRowOrder(b));

    ul.innerHTML = "";
    items.forEach((row) => {
      ul.appendChild(createExtrasGridItem(row, lang));
    });
    ul.hidden = items.length === 0;
    const panel = ul.closest(".menu-extras, .menu-burgers-panel");
    if (panel) panel.hidden = items.length === 0;
  });

  document.querySelectorAll(".menu-block").forEach((block) => {
    const lists = block.querySelectorAll("[data-menu-list], [data-menu-extras-list]");
    if (!lists.length) return;
    const anyVisible = [...lists].some((ul) => !ul.hidden);
    block.hidden = !anyVisible;
  });
}

function applyKidsPromoFromSheet(lang, items) {
  const row = items.cb_kids;
  if (!row) return;
  const nameEl = document.querySelector(
    ".menu-burgers-promo--kids [data-menu-item='cb_kids']"
  );
  const priceEl = document.querySelector(
    ".menu-burgers-promo--kids .menu-item__price"
  );
  if (nameEl) {
    const name = pickLocalized(row, lang, "name");
    if (name) nameEl.textContent = name;
  }
  if (priceEl && row.price !== "" && row.price != null) {
    priceEl.textContent = formatPrice(row.price);
  }
}
