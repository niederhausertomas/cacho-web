/**
 * Canonical, Open Graph, Twitter y JSON-LD a partir de site-config.js
 */
(function initSeoMeta() {
  const site = window.CACHO_SITE;
  if (!site?.url) return;

  const base = site.url.replace(/\/$/, "");

  function abs(path) {
    if (!path || path === "index") return `${base}/`;
    return `${base}/${String(path).replace(/^\//, "")}`;
  }

  document.querySelectorAll("link[data-seo-canonical]").forEach((link) => {
    link.href = abs(link.dataset.seoCanonical);
  });

  const canonical = document.querySelector('link[rel="canonical"]');
  const canonicalHref = canonical?.href || `${base}/`;

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl && !ogUrl.content) {
    ogUrl.content = canonicalHref;
  }

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && site.ogImage && !ogImage.content.includes("http")) {
    ogImage.content = abs(site.ogImage.replace(/^\//, ""));
  }

  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage && site.ogImage && !twitterImage.content.includes("http")) {
    twitterImage.content = abs(site.ogImage.replace(/^\//, ""));
  }

  function postalAddress(addr) {
    return {
      "@type": "PostalAddress",
      streetAddress: addr.street,
      addressLocality: addr.locality,
      postalCode: addr.postalCode,
      addressRegion: addr.region,
      addressCountry: addr.country,
    };
  }

  function restaurantSchema(opts) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: opts.name,
      description: opts.description,
      url: opts.url,
      image: opts.image,
      telephone: site.phone,
      email: site.email,
      priceRange: site.priceRange,
      servesCuisine: site.servesCuisine,
      address: postalAddress(opts.address),
      sameAs: [site.social.instagram, site.social.facebook].filter(Boolean),
    };
    if (opts.geo) {
      schema.geo = {
        "@type": "GeoCoordinates",
        latitude: opts.geo.latitude,
        longitude: opts.geo.longitude,
      };
    }
    if (opts.hasMenu) schema.hasMenu = opts.hasMenu;
    if (opts.potentialAction) schema.potentialAction = opts.potentialAction;
    return schema;
  }

  const mainLd = document.querySelector('script[data-seo-jsonld="restaurant"]');
  if (mainLd) {
    const menus = (site.menuPages || []).map((p) => abs(p));
    mainLd.textContent = JSON.stringify(
      restaurantSchema({
        name: site.name,
        description:
          "Restaurante casero en Poblenou, Barcelona. Comida sin postureo, terraza, carta, reservas y Cacho Burgers.",
        url: abs("index"),
        image: abs(site.ogImage.replace(/^\//, "")),
        address: site.address,
        geo: site.geo,
        hasMenu: menus,
        potentialAction: {
          "@type": "ReserveAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: abs(site.reservasPage || "reservas.html"),
          },
        },
      })
    );
  }

  const burgersLd = document.querySelector('script[data-seo-jsonld="burgers"]');
  if (burgersLd && site.burgers) {
    const b = site.burgers;
    burgersLd.textContent = JSON.stringify(
      restaurantSchema({
        name: b.name,
        description: b.description,
        url: abs(b.page),
        image: abs((b.ogImage || site.ogImage).replace(/^\//, "")),
        address: {
          street: b.street,
          locality: b.locality,
          region: b.region,
          postalCode: b.postalCode,
          country: b.country,
        },
        geo: b.geo,
        potentialAction: {
          "@type": "ReserveAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: abs(site.reservasPage || "reservas.html"),
          },
        },
      })
    );
  }
})();

const OG_LOCALE = { es: "es_ES", ca: "ca_ES", en: "en_US" };

function updateHomeSocialMeta(dictionary, lang) {
  if (!document.getElementById("home")) return;

  const title = dictionary.pageTitle || "";
  const description = dictionary.pageDescription || "";
  const locale = OG_LOCALE[lang] || OG_LOCALE.es;

  const setMeta = (selector, content, attr = "content") => {
    const el = document.querySelector(selector);
    if (el && content) el.setAttribute(attr, content);
  };

  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:locale"]', locale);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
}

window.updateHomeSocialMeta = updateHomeSocialMeta;
