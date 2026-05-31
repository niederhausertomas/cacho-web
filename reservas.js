/**
 * Embed CoverManager en reservas.html (idioma según ES / CA / EN).
 */

function coverManagerLangCode(lang) {
  const code = (lang || "es").slice(0, 2);
  const map = window.CACHO_COVERMANAGER?.lang || {
    es: "spanish",
    ca: "catalan",
    en: "english",
  };
  return map[code] || map.es;
}

function coverManagerReserveUrl(lang) {
  const cfg = window.CACHO_COVERMANAGER;
  if (!cfg?.restaurant || !cfg?.baseUrl) return "";
  return `${cfg.baseUrl}/${cfg.restaurant}/${coverManagerLangCode(lang)}`;
}

function updateCoverManagerReserveLang(lang) {
  const iframe = document.getElementById("covermanager-reserve");
  if (!iframe) return;
  const url = coverManagerReserveUrl(lang);
  if (url && iframe.src !== url) iframe.src = url;
}

function initCoverManagerFrame() {
  const iframe = document.getElementById("covermanager-reserve");
  if (!iframe) return;

  const lang =
    document.documentElement.lang ||
    document.body.dataset.lang ||
    localStorage.getItem("cacho-lang") ||
    "es";
  iframe.src = coverManagerReserveUrl(lang);
  bindCoverManagerIframeResize();
}

function bindCoverManagerIframeResize() {
  const run = () => {
    if (typeof iFrameResize !== "function") return;
    iFrameResize(
      {
        log: false,
        checkOrigin: ["https://www.covermanager.com"],
        heightCalculationMethod: "bodyScroll",
      },
      "#covermanager-reserve"
    );
  };
  if (typeof iFrameResize === "function") run();
  else window.addEventListener("load", run, { once: true });
}

window.updateCoverManagerReserveLang = updateCoverManagerReserveLang;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCoverManagerFrame);
} else {
  initCoverManagerFrame();
}
