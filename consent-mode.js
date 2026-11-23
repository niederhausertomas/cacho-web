/**
 * Google Tag Manager con Consent Mode v2.
 * Pedido de Vicky (marketing de Cacho), 2026-11-23: GTM `GTM-TWSRS6QX`, el mismo
 * contenedor que menus.wearecacho.com (repo cacho-bhs, src/lib/consent.ts).
 *
 * Tiene que ser el PRIMER script del <head>, sin async ni defer:
 * 1. consentimiento por defecto, todo denegado;
 * 2. si ya hay una elección guardada, se aplica enseguida (así una visita
 *    que vuelve no arranca denegada);
 * 3. recién después carga GTM.
 *
 * La elección se guarda en la cookie `cacho_consent` de `.wearecacho.com`,
 * compartida con menus.wearecacho.com. Formato (igual en los dos proyectos):
 * encodeURIComponent(JSON.stringify({ v: 1, essential: true, analytics,
 * marketing, maps, updatedAt })). Si no hay cookie, se usa la clave vieja de
 * localStorage `cacho-cookie-consent` (script.js la migra a la cookie).
 *
 * GTM solo carga en el dominio real, para no ensuciar las métricas con
 * pruebas en local. GA4 va DENTRO de GTM: no cargarlo aparte.
 */
(function () {
  var GTM_ID = "GTM-TWSRS6QX";
  var GTM_HOSTNAMES = ["wearecacho.com", "www.wearecacho.com"];

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
  gtag("set", "ads_data_redaction", true);

  function storedConsent() {
    try {
      var m = document.cookie.match(/(?:^|; )cacho_consent=([^;]*)/);
      if (m) return JSON.parse(decodeURIComponent(m[1]));
    } catch (e) {}
    try {
      return JSON.parse(localStorage.getItem("cacho-cookie-consent"));
    } catch (e) {}
    return null;
  }

  var c = storedConsent();
  if (c && c.v === 1) {
    var ads = c.marketing ? "granted" : "denied";
    gtag("consent", "update", {
      analytics_storage: c.analytics ? "granted" : "denied",
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
    });
  }

  if (GTM_HOSTNAMES.indexOf(location.hostname) !== -1) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s);
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", GTM_ID);
  }
})();
