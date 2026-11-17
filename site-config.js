/**
 * URL pública del sitio (sin barra final).
 * Cambiar al pasar a dominio propio, ej. https://www.wearecacho.com
 */
window.CACHO_SITE = {
  url: "https://www.wearecacho.com",
  name: "CACHO",
  tagline: "Casero y sin miedo",
  email: "hello@wearecacho.com",
  phone: "+34931398813",
  priceRange: "€€",
  servesCuisine: ["Comida casera", "Argentina", "Hamburguesas", "Cócteles"],
  openingHours: ["Mo-Fr 12:30-00:00", "Sa-Su 12:00-00:00"],
  address: {
    street: "Carrer de Llull, 27",
    locality: "Barcelona",
    region: "CT",
    postalCode: "08005",
    country: "ES",
  },
  geo: {
    latitude: 41.3994,
    longitude: 2.1974,
  },
  burgers: {
    name: "Cacho Burgers",
    description:
      "Smash burgers, fritas y cookies en Poblenou. Local CACHO en Carrer de Pujades, 195.",
    street: "Carrer de Pujades, 195",
    locality: "Barcelona",
    region: "CT",
    postalCode: "08005",
    country: "ES",
    openingHours: ["We,Su 13:00-15:30", "We,Su 19:00-22:00", "Th-Sa 13:00-15:30", "Th-Sa 19:00-22:30"],
    geo: {
      latitude: 41.4015,
      longitude: 2.2048,
    },
    page: "cacho-burgers.html",
    ogImage: "/images/carrusel1.jpg",
  },
  ogImage: "/images/carrusel1.jpg",
  menuPages: ["comidas.html", "bebidas.html", "menu-grupos.html", "cacho-burgers.html"],
  reservasPage: "reservas.html",
  social: {
    instagram: "https://www.instagram.com/wearecacho/",
    facebook: "https://www.facebook.com/CACHO-110555300531308",
  },
};
