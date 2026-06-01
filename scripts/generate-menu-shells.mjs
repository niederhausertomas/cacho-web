#!/usr/bin/env node
/**
 * Convierte listas de carta en contenedores vacíos data-menu-list / data-menu-extras-list.
 * Uso: node scripts/generate-menu-shells.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** id -> { section, group } para reasignar filas al exportar */
const ITEM_GROUPS = {
  itant: { section: "wine", group: "red" },
  comalats: { section: "wine", group: "redNat" },
  karma: { section: "wine", group: "redNat" },
  trus: { section: "wine", group: "redNat" },
  cargol: { section: "wine", group: "whiteNat" },
  methodic: { section: "wine", group: "whiteNat" },
  surrealista: { section: "wine", group: "whiteNat" },
  perlat: { section: "wine", group: "whiteNat" },
  saltimbanqui: { section: "wine", group: "white" },
  descarada: { section: "wine", group: "white" },
  serra: { section: "wine", group: "white" },
  freye: { section: "wine", group: "rose" },
  musugorri: { section: "wine", group: "vermouth" },
  brutNature: { section: "wine", group: "cava" },
  hendricks: { section: "spirits", group: "gin" },
  ginMare: { section: "spirits", group: "gin" },
  seagrams: { section: "spirits", group: "gin" },
  tanqueray: { section: "spirits", group: "gin" },
  bulldog: { section: "spirits", group: "gin" },
  ginMg: { section: "spirits", group: "gin" },
  greyGoose: { section: "spirits", group: "vodka" },
  absolut: { section: "spirits", group: "vodka" },
  skyy: { section: "spirits", group: "vodka" },
  zacapa: { section: "spirits", group: "rum" },
  brugal: { section: "spirits", group: "rum" },
  abueloAnejo: { section: "spirits", group: "rum" },
  glenmorangie: { section: "spirits", group: "whiskey" },
  johnnieWalker: { section: "spirits", group: "whiskey" },
  jackDaniels: { section: "spirits", group: "whiskey" },
  herradura: { section: "spirits", group: "tequila" },
  joseCuervo: { section: "spirits", group: "tequila" },
  mezcalUnion: { section: "spirits", group: "tequila" },
  fernet: { section: "spirits", group: "liqueurs" },
  ratafia: { section: "spirits", group: "liqueurs" },
  limoncello: { section: "spirits", group: "liqueurs" },
  baileys: { section: "spirits", group: "liqueurs" },
  campariShot: { section: "spirits", group: "liqueurs" },
  disaronno: { section: "spirits", group: "liqueurs" },
  aperolShot: { section: "spirits", group: "liqueurs" },
  cointreau: { section: "spirits", group: "liqueurs" },
  extraEgg: { section: "burgers", group: "extras" },
  extraBacon: { section: "burgers", group: "extras" },
  extraAvocado: { section: "burgers", group: "extras" },
  extraPickles: { section: "burgers", group: "extras" },
  extraCheese: { section: "burgers", group: "extras" },
  extraTomato: { section: "burgers", group: "extras" },
  cb_extra_xl: { section: "fries", group: "extras" },
  cb_extra_bacon: { section: "fries", group: "extras" },
  cb_extra_jalapeno: { section: "fries", group: "extras" },
  cb_extra_salsa: { section: "fries", group: "extras" },
  cb_addon_meat: { section: "addons", group: "extras" },
  cb_addon_cheese: { section: "addons", group: "extras" },
  gr_starter1: { section: "full", group: "starter" },
  gr_starter2: { section: "full", group: "starter" },
  gr_main1: { section: "full", group: "main" },
  gr_main2: { section: "full", group: "main" },
  gr_main3: { section: "full", group: "main" },
  gr_main4: { section: "full", group: "main" },
  gr_dessert1: { section: "full", group: "dessert" },
  gr_dessert2: { section: "full", group: "dessert" },
  gr_drink1: { section: "full", group: "drink" },
  gr_drink2: { section: "full", group: "drink" },
  gr_drink3: { section: "full", group: "drink" },
  icedTea: { section: "coffee", group: "refresh" },
  lemonade: { section: "coffee", group: "refresh" },
  juice: { section: "coffee", group: "refresh" },
  greenQueen: { section: "coffee", group: "refresh" },
  orangePower: { section: "coffee", group: "refresh" },
  redHunter: { section: "coffee", group: "refresh" },
  gingerBeer: { section: "coffee", group: "refresh" },
  kombucha: { section: "coffee", group: "refresh" },
  sunny: { section: "coffee", group: "refresh" },
  tropical: { section: "coffee", group: "refresh" },
  claraTea: { section: "coffee", group: "refresh" },
  baya: { section: "coffee", group: "refresh" },
  caramel: { section: "coffee", group: "coffee" },
  classicLatte: { section: "coffee", group: "coffee" },
  flatWhite: { section: "coffee", group: "coffee" },
  latte: { section: "coffee", group: "coffee" },
  matcha: { section: "coffee", group: "coffee" },
  chai: { section: "coffee", group: "coffee" },
  espresso: { section: "coffee", group: "coffee" },
};

const WINE_SUB = {
  red: "red",
  redNat: "redNat",
  whiteNat: "whiteNat",
  white: "white",
  rose: "rose",
  vermouth: "vermouth",
  cava: "cava",
};

const SPIRIT_SUB = {
  gin: "gin",
  vodka: "vodka",
  rum: "rum",
  whiskey: "whiskey",
  tequila: "tequila",
  liqueurs: "liqueurs",
};

function emptyList(attrs, className = "menu-list") {
  return `<ul class="${className}" ${attrs}></ul>`;
}

function convertBebidas(html) {
  let out = html;

  out = out.replace(
    /<section class="menu-block" id="cocktails">[\s\S]*?<ul class="menu-list">[\s\S]*?<\/ul>/,
    `<section class="menu-block" id="cocktails">
      <h2 class="menu-block__title" data-menu-section="cocktails" data-menu-field="title"></h2>
      ${emptyList('data-menu-list="cocktails"')}`
  );

  out = out.replace(
    /<p class="menu-block__sizes"><span data-i18n="size33">[\s\S]*?<\/p>\s*<ul class="menu-list">[\s\S]*?<\/ul>\s*<\/section>\s*<section class="menu-block" id="sin-alcohol">/,
    `<p class="menu-block__sizes"><span data-i18n="size33">33cl</span><span data-i18n="size50">50cl</span></p>
      ${emptyList('data-menu-list="beer"')}
    </section>

    <section class="menu-block" id="sin-alcohol">`
  );

  out = out.replace(
    /<section class="menu-block" id="sin-alcohol">[\s\S]*?<ul class="menu-list">[\s\S]*?<\/ul>/,
    `<section class="menu-block" id="sin-alcohol">
      <h2 class="menu-block__title" data-menu-section="zero" data-menu-field="title"></h2>
      ${emptyList('data-menu-list="zero"')}`
  );

  const wineBlock = `<section class="menu-block" id="vinitos">
      <h2 class="menu-block__title" data-menu-section="wine" data-menu-field="title"></h2>
      <p class="menu-block__sizes menu-block__sizes--wine"><span data-i18n="sizeGlass">Copa</span><span data-i18n="sizeBottle">Botella</span></p>
${Object.entries(WINE_SUB)
  .map(
    ([key, sub]) =>
      `      <h3 class="menu-subtitle" data-menu-sub="${sub}"></h3>\n      ${emptyList(`data-menu-list="wine" data-menu-group="${key}"`)}`
  )
  .join("\n")}
    </section>`;

  out = out.replace(
    /<section class="menu-block" id="vinitos">[\s\S]*?<\/section>\s*<section class="menu-block" id="combinados">/,
    `${wineBlock}

    <section class="menu-block" id="combinados">`
  );

  let spiritsBlock = `<section class="menu-block" id="combinados">
      <h2 class="menu-block__title" data-menu-section="spirits" data-menu-field="title"></h2>
      <p class="menu-block__note" data-menu-section="spirits" data-menu-field="note"></p>`;
  for (const sub of Object.values(SPIRIT_SUB)) {
    spiritsBlock += `\n      <h3 class="menu-subtitle" data-menu-sub="${sub}"></h3>\n      ${emptyList(
      `data-menu-list="spirits" data-menu-group="${sub}"`,
      "menu-list menu-list--compact"
    )}`;
  }
  spiritsBlock += `\n    </section>`;

  out = out.replace(
    /<section class="menu-block" id="combinados">[\s\S]*?<\/section>\s*<section class="menu-block" id="cafe-refrescos">/,
    `${spiritsBlock}

    <section class="menu-block" id="cafe-refrescos">`
  );

  const coffeeBlock = `<section class="menu-block" id="cafe-refrescos">
      <h2 class="menu-block__title" data-menu-section="coffee" data-menu-field="title"></h2>
      <p class="menu-block__note" data-menu-section="coffee" data-menu-field="note"></p>
      <p class="menu-block__sizes"><span data-i18n="sizeSmall">Pequeño</span><span data-i18n="sizeLarge">Grande</span></p>
      ${emptyList('data-menu-list="coffee" data-menu-group="coffee"')}
      <h3 class="menu-subtitle" data-menu-section="coffee" data-menu-field="refreshTitle"></h3>
      <p class="menu-block__note" data-menu-section="coffee" data-menu-field="refreshNote"></p>
      ${emptyList('data-menu-list="coffee" data-menu-group="refresh"')}
    </section>`;

  out = out.replace(
    /<section class="menu-block" id="cafe-refrescos">[\s\S]*?<\/section>\s*<footer class="menu-page__foot">/,
    `${coffeeBlock}

    <footer class="menu-page__foot">`
  );

  return out;
}

function convertComidas(html) {
  const sections = [
    ["ensaladas", "salads"],
    ["compartir", "share"],
    ["grill", "grill"],
    ["milanesas", "milanese"],
    ["burgers", "burgers"],
    ["sandwiches", "sandwiches"],
    ["dulces", "desserts"],
  ];

  let out = html;
  for (const [id, section] of sections) {
    const re = new RegExp(
      `<section class="menu-block" id="${id}">([\\s\\S]*?)<ul class="menu-list">[\\s\\S]*?<\\/ul>`,
      "m"
    );
    out = out.replace(re, (match, head) => {
      const extras =
        section === "burgers"
          ? `
      <aside class="menu-extras">
        <h3 class="menu-extras__title" data-menu-section="burgers" data-menu-field="extrasTitle"></h3>
        <p class="menu-extras__lead" data-menu-section="burgers" data-menu-field="extrasLead"></p>
        <ul class="menu-extras__grid" data-menu-extras-list="burgers" data-menu-group="extras"></ul>
      </aside>`
          : "";
      return `<section class="menu-block" id="${id}">${head}${emptyList(
        `data-menu-list="${section}"`
      )}${extras}`;
    });
  }
  return out;
}

function convertGroups(html) {
  let out = html;

  out = out.replace(
    /<section class="menu-block" id="menu-grupos">[\s\S]*?<\/section>/,
    `<section class="menu-block" id="menu-grupos">
      <h2 class="menu-block__title" data-menu-section="full" data-menu-field="title"></h2>
      <p class="menu-block__note" data-menu-section="full" data-menu-field="note"></p>
      <p class="menu-package-price"><span class="menu-package-price__amount" data-package-id="package_full"></span><span class="menu-package-price__unit" data-i18n="pricePerPerson">/ persona</span></p>
      ${emptyList('data-menu-list="full" data-menu-group="starter"', "menu-list menu-list--plain")}
      <h3 class="menu-subtitle" data-menu-section="full" data-menu-field="mainTitle"></h3>
      ${emptyList('data-menu-list="full" data-menu-group="main"', "menu-list menu-list--plain")}
      <p class="menu-block__note" data-menu-section="full" data-menu-field="mainNote"></p>
      <h3 class="menu-subtitle" data-menu-section="full" data-menu-field="dessertTitle"></h3>
      ${emptyList('data-menu-list="full" data-menu-group="dessert"', "menu-list menu-list--plain")}
      <h3 class="menu-subtitle" data-menu-section="full" data-menu-field="drinkTitle"></h3>
      ${emptyList('data-menu-list="full" data-menu-group="drink"', "menu-list menu-list--plain")}
    </section>`
  );

  out = out.replace(
    /<section class="menu-block" id="pica-pica">[\s\S]*?<\/section>/,
    `<section class="menu-block" id="pica-pica">
      <h2 class="menu-block__title" data-menu-section="pica" data-menu-field="title"></h2>
      <p class="menu-block__note" data-menu-section="pica" data-menu-field="note"></p>
      <p class="menu-package-price"><span class="menu-package-price__amount" data-package-id="package_pica"></span><span class="menu-package-price__unit" data-i18n="pricePerPerson">/ persona</span></p>
      ${emptyList('data-menu-list="pica"', "menu-list menu-list--plain")}
    </section>`
  );

  return out;
}

function convertCachoBurgers(html) {
  let out = html;

  out = out.replace(
    /<section class="menu-block" id="fritas">[\s\S]*?<\/section>\s*<section class="menu-block" id="cookies">/,
    `<section class="menu-block" id="fritas">
      <h2 class="menu-block__title" data-menu-section="fries" data-menu-field="title"></h2>
      ${emptyList('data-menu-list="fries"')}
      <aside class="menu-burgers-panel">
        <h3 class="menu-burgers-panel__title" data-menu-section="fries" data-menu-field="extrasTitle"></h3>
        <ul class="menu-extras__grid" data-menu-extras-list="fries" data-menu-group="extras"></ul>
      </aside>
    </section>

    <section class="menu-block" id="cookies">`
  );

  out = out.replace(
    /<section class="menu-block" id="cookies">[\s\S]*?<\/section>\s*<section class="menu-block menu-block--burgers-list" id="burgers">/,
    `<section class="menu-block" id="cookies">
      <h2 class="menu-block__title" data-menu-section="cookies" data-menu-field="title"></h2>
      ${emptyList('data-menu-list="cookies"')}
    </section>

    <section class="menu-block menu-block--burgers-list" id="burgers">`
  );

  out = out.replace(
    /<section class="menu-block menu-block--burgers-list" id="burgers">[\s\S]*?<\/section>\s*<section class="menu-block" id="combo">/,
    `<section class="menu-block menu-block--burgers-list" id="burgers">
      <h2 class="menu-block__title" data-menu-section="burgers" data-menu-field="title"></h2>
      <p class="menu-block__sizes menu-block__sizes--burgers"><span data-i18n="cbSizeSimple">Simple</span><span data-i18n="cbSizeDouble">Doble</span></p>
      ${emptyList('data-menu-list="burgers"')}
      <aside class="menu-burgers-panel menu-burgers-panel--addons">
        <h3 class="menu-burgers-panel__title" data-menu-section="addons" data-menu-field="title"></h3>
        <ul class="menu-extras__grid" data-menu-extras-list="addons" data-menu-group="extras"></ul>
      </aside>
    </section>

    <section class="menu-block" id="combo">`
  );

  out = out.replace(
    /<strong data-menu-item="cb_kids"[^>]*>[^<]*<\/strong>/,
    `<strong data-menu-item="cb_kids" data-menu-part="name"></strong>`
  );
  out = out.replace(
    /<span class="menu-item__price">10,9<\/span>/,
    `<span class="menu-item__price"></span>`
  );

  return out;
}

function injectScripts(html) {
  if (html.includes("menu-render.js")) return html;
  return html.replace(
    '<script src="./menu-sheet.js',
    '<script src="./menu-render.js?v=1"></script>\n  <script src="./menu-sheet.js'
  );
}

export { ITEM_GROUPS };

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const files = {
    "comidas.html": convertComidas,
    "bebidas.html": convertBebidas,
    "menu-grupos.html": convertGroups,
    "cacho-burgers.html": convertCachoBurgers,
  };

  for (const [file, fn] of Object.entries(files)) {
    const p = path.join(root, file);
    let html = fs.readFileSync(p, "utf8");
    html = fn(html);
    html = injectScripts(html);
    fs.writeFileSync(p, html);
    console.log("✓", file);
  }
}
