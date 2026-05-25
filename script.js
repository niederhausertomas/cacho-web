const header = document.querySelector(".site-header");
const navMenu = document.querySelector("#nav-menu");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".nav-shell a[href^='#']")];
const navSectionLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
const languageButtons = [...document.querySelectorAll(".language-switcher button")];
const mobileCta = document.querySelector(".mobile-cta");
const LANG_STORAGE_KEY = "cacho-lang";

/** Reemplaza con tu ID de Formspree (https://formspree.io → nuevo formulario → hello@wearecacho.com). */
const FORMSPREE_FORM_ID = "YOUR_FORM_ID";

const translations = {
  es: {
    pageTitle: "CACHO | MVP rediseño",
    pageDescription: "MVP visual para la nueva estructura de CACHO Barcelona.",
    navAria: "Navegación principal",
    langSwitcherAria: "Selector de idioma",
    navToggleLabel: "Abrir menú",
    navToggleClose: "Cerrar menú",
    claim: "casero y sin miedo",
    navReservations: "Reservas",
    navBook: "Reservar",
    navWhat: "Qué es Cacho",
    navBusiness: "Servicios",
    navMenu: "Carta",
    navLocation: "Ubicación",
    navContact: "Contacto",
    navLanguages: "Idiomas",
    navBurgers: "Cacho Burgers",
    heroAria: "CACHO home",
    heroCartelLine1: "Reserva tu mesa con tan",
    heroCartelLine2: "solo un click",
    bookTable: "Reservar mesa",
    viewLocation: "Ver ubicación",
    tapeReservations: "RESERVAS",
    bookingTitle: "La acción principal, visible desde móvil.",
    bookingText:
      "El rediseño convierte la reserva en el primer camino natural. El botón se repite en zonas clave y se mantiene fijo como acción rápida en móvil.",
    bookNow: "Reservar ahora",
    bookingArea: "PobleNou",
    hoursMonWed: "Lun-mié: 12:30h - 23h",
    hoursThuFri: "Jue-vie: 12:30h - 24h",
    hoursWeekend: "Fin de semana: 12h - 23:30h",
    productsAria: "Qué vendemos",
    tapeProducts: "¿Qué hacemos?",
    productsTitle: "Platos, burgers, carnes y afterwork.",
    productsText:
      "Hacemos una COMIDA CASERA Y SIN MIEDO, sin pretensiones, pero consciente de lo que nos rodea, hecha en casa todos los días con productos frescos y sin procesar. Nuestra oferta pasa desde platos saludables para el día a día como carnes al más puro estilo Argentino, sandwiches, burgers, ensaladas. Postres con la receta original de la abuela, zumos naturales y cocteles con las mejores combinaciones.\n\nTenemos un CACHO diferente para cada momento y lo dividimos en tres grupos, cacho plato, Dinner y Brunch.",
    altBurger: "Hamburguesa CACHO",
    altDish: "Plato CACHO",
    altBeer: "Cerveza CACHO",
    aboutTitle: "Qué es Cacho",
    altAbout: "Equipo y ambiente de CACHO",
    aboutText1:
      "Somos CACHO y llegamos a Poblenou con ganas de generar un espacio diferente donde los vecinos del barrio puedan encontrar comida casera y de calidad, cervezas tiradas y un ambiente genial en la terraza más grande del @22.",
    aboutText2:
      "Pásate a conocernos que no mordemos (casi nunca) y tenemos CACHO para cuando quieras: Comidas, after work y brunch los fines de semana. Ya hemos dicho que no tenemos miedo 😉",
    cateringTitle: "Catering, Cacho Plato y After Work & Dinner.",
    cateringCard1Title: "Cacho Catering",
    cateringCard1Text1:
      "Si tienes un evento, nosotros nos encargamos del sabor. Con nuestro Cacho Catering, te lo ponemos fácil: calidad, buen producto y el toque de Cacho que tu evento merece.",
    cateringCard1Text2:
      "Para empresas, celebraciones y cualquier ocasión especial. Escríbenos y lo hacemos posible. 💬 HELLO@WEARECACHO.COM",
    cateringCard2Title: "Cacho Plato",
    cateringCard2Text1:
      "Entra, coge tu plato y elige entre nuestras diferentes opciones ya cocinadas previamente. Carnes y guarniciones de veggies con los mejores productos de temporada. Una opción sana que te robará poco tiempo en tu ajetreado día a día, además de económico.",
    cateringCard2Text2:
      "Las diferentes opciones irán cambiando cada dos semanas, tenemos la fórmula perfecta de Lunes a Viernes de 12:30h a 16h.",
    cateringCard3Title: "After Work & Dinner",
    cateringCard3Text1:
      "No es lo mismo terminar el día e ir a casa que ir al afterwork de cacho y te vamos a explicar por qué: Llegas a esa esquina de Poblenou y suena buena música, pides la primera cerveza y la acompañas de nuestras patatas con salsa chiplote porque te lo mereces.",
    cateringCard3Text2:
      "Tus amigos van llegando y cuando pasa nuestra camarera cae la segunda ronda, ya sabes que vas terminando cenando ahí.",
    cateringCard3Text3:
      "Gran variedad de opciones, Smash Burger, carnes Argentinas, milanesas, sandwiches, nachos, opciones veganas, entre otras.",
    tapeLanguages: "IDIOMAS / WPML",
    languagesTitle: "Una página base y sus traducciones SEO por idioma.",
    languagesText:
      "Con WPML cada página importante se traduce como página equivalente en español, catalán e inglés. El selector lleva a la versión correcta, con URL propia, slugs traducidos, metadatos y hreflang.",
    wpmlGridAria: "Estructura WPML propuesta",
    wpmlHome: "Home",
    wpmlReservations: "Reservas",
    wpmlAbout: "Qué es Cacho",
    wpmlCatering: "Catering empresas",
    wpmlMenu: "Carta",
    wpmlBurgers: "Cacho Burgers",
    wpmlAboutEs: "bloque en home",
    wpmlAboutCa: "bloc a home",
    wpmlAboutEn: "home block",
    wpmlCleanup1: "Migrar desde Polylang a WPML.",
    wpmlCleanup2: "Eliminar duplicados y borradores.",
    wpmlCleanup3: "Traducir slugs y metas SEO.",
    wpmlCleanup4: "Validar hreflang y sitemaps.",
    wpmlNoteTitle: "Decisión recomendada",
    wpmlNoteText:
      "Usar WPML como sistema único de idiomas. Mantener una estructura espejo por idioma y evitar mezclar plugins multidioma para no duplicar URLs, menús ni etiquetas SEO.",
    tapeServices: "Servicios.",
    tapeMenu: "Carta.",
    menuTitle: "Comidas, bebidas y grupos.",
    menuFood: "Comidas",
    menuDrinks: "Bebidas",
    menuGroups: "Menú grupos",
    tapeLocation: "UBICACIÓN",
    locationTitle: "Ubicación y horarios",
    locationAddress: "Carrer de Llull, 27. 08005 Barcelona",
    openMaps: "Abrir en Google Maps",
    mapTitle: "Mapa de CACHO Poblenou",
    burgersTitle: "Cacho Burgers",
    burgersLead: "¿Aún no habéis venido a probar nuestras burgers sin postureo?",
    burgersMeet: "Nos vemos en Pujades, 195 · Poblenou",
    altBurgersBrand: "Cacho Burgers",
    miniMenuTitle: "Carta",
    miniMenuText: "Smash burgers, sides y bebidas. Enlace a PDF o página propia.",
    miniLocationTitle: "Ubicación",
    miniLocationText: "Dirección del nuevo local y mapa. Sin horarios, tal como se pidió.",
    miniDeliveryTitle: "Delivery",
    miniDeliveryText: "Acceso directo a plataformas de delivery o pedidos propios.",
    miniContactTitle: "Contacto",
    miniContactText: "Teléfono, email o WhatsApp específico si lo tienen.",
    tapeContact: "CONTACTO",
    tapeContactTitle: "Contacto.",
    contactTitle: "Estamos aquí.",
    contactText:
      "Se elimina «Qué pasa en Cacho» y el mapa gana presencia. El formulario queda más genérico y aparece una entrada separada para trabajar con CACHO.",
    formName: "Nombre",
    formNamePh: "Tu nombre",
    formEmail: "Email",
    formEmailPh: "tu@email.com",
    formMessage: "Mensaje",
    formMessagePh: "Cuéntanos qué necesitas",
    formSubmit: "Enviar consulta",
    formSending: "Enviando…",
    formSuccess: "Gracias. Hemos recibido tu mensaje y te responderemos pronto.",
    formError: "No se pudo enviar. Inténtalo de nuevo o escríbenos a hello@wearecacho.com.",
    formNotConfigured: "Formulario pendiente de configurar (Formspree).",
    formSubject: "Consulta web CACHO",
    workWithUs: "Trabaja con nosotros",
    whatsappAria: "Contactar por WhatsApp",
    footerNetworks: "Redes",
    footerSocialInstagram: "Instagram de CACHO",
    footerSocialFacebook: "Facebook de CACHO",
    footerSocialTripadvisor: "Tripadvisor de CACHO",
    footerSitemap: "Mapa del sitio",
    footerHome: "Inicio",
    footerReservations: "Reservas",
    footerBusiness: "Empresas",
    footerMenu: "Carta",
    footerLanguages: "Idiomas",
    footerBurgers: "Burgers",
    footerContact: "Contacto",
    footerCookies: "Cookies",
    footerManageCookies: "Gestionar cookies",
    footerLegalCopyright: "CACHO © 2020–2026 TODOS LOS DERECHOS RESERVADOS",
    footerLegalNotice: "Aviso legal",
    footerLegalCookies: "Políticas de cookies",
    cookieSettingsFab: "Ajustes cookies",
    tapeCookies: "COOKIES",
    cookiesPolicyTitle: "Política de cookies",
    cookiesPolicyIntro:
      "En CACHO usamos cookies y tecnologías similares para que el sitio funcione, recordar tu idioma y, si lo autorizas, medir el uso de la web y campañas. Puedes cambiar tu decisión en cualquier momento con «Gestionar cookies».",
    cookiesEssentialTitle: "Cookies necesarias",
    cookiesEssentialText:
      "Son imprescindibles para el funcionamiento básico. Incluyen la preferencia de idioma guardada en tu navegador (localStorage). No requieren consentimiento.",
    cookiesOptionalTitle: "Cookies opcionales",
    cookiesOptionalText: "Solo se activan si las aceptas desde el banner o la configuración de cookies.",
    cookiesTableAria: "Tabla de cookies",
    cookiesTableName: "Nombre / tipo",
    cookiesTableProvider: "Proveedor",
    cookiesTablePurpose: "Finalidad",
    cookiesTableDuration: "Duración",
    cookiesRowGaName: "Analítica (_ga, _gid…)",
    cookiesRowGaPurpose: "Estadísticas de visitas y uso",
    cookiesRowGaDuration: "Hasta 24 meses",
    cookiesRowMetaName: "Marketing (_fbp…)",
    cookiesRowMetaPurpose: "Medición de campañas y conversiones",
    cookiesRowMetaDuration: "Hasta 90 días",
    cookiesRowMapsName: "Mapa embebido",
    cookiesRowMapsPurpose: "Mostrar la ubicación del local",
    cookiesRowMapsDuration: "Según Google",
    cookiesPolicyNote:
      "Configura en script.js los IDs reales de Google Analytics (GA4) y Meta Pixel antes de publicar.",
    cookieBannerTitle: "Cookies y privacidad",
    cookieBannerText:
      "Usamos cookies necesarias para el idioma y, si lo permites, Google Analytics, Meta Pixel y Google Maps. Puedes aceptar todas, usar solo las necesarias o configurarlas.",
    cookieAcceptAll: "Aceptar todas",
    cookieReject: "Solo necesarias",
    cookieCustomize: "Configurar",
    cookieMore: "Política de cookies",
    cookiePrefsTitle: "Preferencias de cookies",
    cookiePrefEssential: "Necesarias",
    cookiePrefEssentialDesc: "Idioma y funcionamiento básico del sitio.",
    cookiePrefAnalytics: "Analítica (Google Analytics)",
    cookiePrefAnalyticsDesc: "Nos ayuda a entender cómo se usa la web.",
    cookiePrefMarketing: "Marketing (Meta Pixel)",
    cookiePrefMarketingDesc: "Mide campañas y conversiones en redes sociales.",
    cookiePrefMaps: "Mapa (Google Maps)",
    cookiePrefMapsDesc: "Muestra el mapa de ubicación embebido.",
    cookieSave: "Guardar preferencias",
    cookieBack: "Volver",
    mapConsentText:
      "El mapa integrado usa cookies de Google. Puedes activarlo aquí o abrir la ubicación en Google Maps.",
    mapConsentBtn: "Activar mapa",
    mapOpenExternal: "Abrir en Google Maps"
  },
  ca: {
    pageTitle: "CACHO | MVP redisseny",
    pageDescription: "MVP visual per a la nova estructura de CACHO Barcelona.",
    navAria: "Navegació principal",
    langSwitcherAria: "Selector d'idioma",
    navToggleLabel: "Obrir menú",
    navToggleClose: "Tancar menú",
    claim: "casolà i sense por",
    navReservations: "Reserves",
    navBook: "Reserva",
    navWhat: "Què és Cacho",
    navBusiness: "Serveis",
    navMenu: "Carta",
    navLocation: "Ubicació",
    navContact: "Contacte",
    navLanguages: "Idiomes",
    navBurgers: "Cacho Burgers",
    heroAria: "CACHO inici",
    heroCartelLine1: "Reserva la teva taula amb",
    heroCartelLine2: "un sol clic",
    bookTable: "Reservar taula",
    viewLocation: "Veure ubicació",
    tapeReservations: "RESERVES",
    bookingTitle: "L'acció principal, visible des del mòbil.",
    bookingText:
      "El redisseny converteix la reserva en el primer camí natural. El botó es repeteix a zones clau i es manté fix com a acció ràpida al mòbil.",
    bookNow: "Reservar ara",
    bookingArea: "PobleNou",
    hoursMonWed: "Dill-dij: 12:30h - 23h",
    hoursThuFri: "Div-diss: 12:30h - 24h",
    hoursWeekend: "Cap de setmana: 12h - 23:30h",
    productsAria: "Què venem",
    tapeProducts: "Què fem?",
    productsTitle: "Plats, burgers, carns i afterwork.",
    productsText:
      "Fem un MENJAR CASOLÀ I SENSE POR, sense pretensions, però conscients del que ens envolta, fet a casa cada dia amb productes frescos i sense processar. La nostra oferta va des de plats saludables per al dia a dia fins a carns al més pur estil argentí, sandwiches, burgers i amanides. Postres amb la recepta original de l'àvia, sucs naturals i còctels amb les millors combinacions.\n\nTenim un CACHO diferent per a cada moment i ho dividim en tres grups: cacho plat, Dinner i Brunch.",
    altBurger: "Hamburguesa CACHO",
    altDish: "Plat CACHO",
    altBeer: "Cervesa CACHO",
    aboutTitle: "Què és Cacho",
    altAbout: "Equip i ambient de CACHO",
    aboutText1:
      "Som CACHO i arribem al Poblenou amb ganes de generar un espai diferent on els veïns del barri puguin trobar menjar casolà i de qualitat, cerveses tirades i un ambient genial a la terrassa més gran del @22.",
    aboutText2:
      "Passa a conèixer-nos que no mosseguem (gairebé mai) i tenim CACHO per quan vulguis: menjars, after work i brunch els caps de setmana. Ja hem dit que no tenim por 😉",
    cateringTitle: "Catering, Cacho Plat i After Work & Dinner.",
    cateringCard1Title: "Cacho Catering",
    cateringCard1Text1:
      "Si tens un esdeveniment, nosaltres ens encarreguem del sabor. Amb el nostre Cacho Catering, t'ho posem fàcil: qualitat, bon producte i el toc de Cacho que el teu esdeveniment mereix.",
    cateringCard1Text2:
      "Per a empreses, celebracions i qualsevol ocasió especial. Escriu-nos i ho fem possible. 💬 HELLO@WEARECACHO.COM",
    cateringCard2Title: "Cacho Plat",
    cateringCard2Text1:
      "Entra, agafa el teu plat i tria entre les nostres diferents opcions ja cuinades prèviament. Carns i guarnicions de veggies amb els millors productes de temporada. Una opció sana que et robarà poc temps en el teu dia a dia, a més d'econòmica.",
    cateringCard2Text2:
      "Les diferents opcions aniran canviant cada dues setmanes; tenim la fórmula perfecta de dilluns a divendres de 12:30h a 16h.",
    cateringCard3Title: "After Work & Dinner",
    cateringCard3Text1:
      "No és el mateix acabar el dia i anar a casa que anar a l'afterwork de cacho i t'ho expliquem: arribes a aquella cantonada del Poblenou i sona bona música, demanes la primera cervesa i l'acompanyes de les nostres patates amb salsa chiplote perquè t'ho mereixes.",
    cateringCard3Text2:
      "Els teus amics van arribant i quan passa la nostra cambrera cau la segona ronda, ja saps que acabaràs sopant allà.",
    cateringCard3Text3:
      "Gran varietat d'opcions: Smash Burger, carns argentines, milaneses, sandwiches, nachos, opcions veganes, entre d'altres.",
    tapeLanguages: "IDIOMES / WPML",
    languagesTitle: "Una pàgina base i les seves traduccions SEO per idioma.",
    languagesText:
      "Amb WPML cada pàgina important es tradueix com a pàgina equivalent en espanyol, català i anglès. El selector porta a la versió correcta, amb URL pròpia, slugs traduïts, metadades i hreflang.",
    wpmlGridAria: "Estructura WPML proposada",
    wpmlHome: "Home",
    wpmlReservations: "Reserves",
    wpmlAbout: "Què és Cacho",
    wpmlCatering: "Catering empreses",
    wpmlMenu: "Carta",
    wpmlBurgers: "Cacho Burgers",
    wpmlAboutEs: "bloque en home",
    wpmlAboutCa: "bloc a home",
    wpmlAboutEn: "home block",
    wpmlCleanup1: "Migrar de Polylang a WPML.",
    wpmlCleanup2: "Eliminar duplicats i esborranys.",
    wpmlCleanup3: "Traduir slugs i metes SEO.",
    wpmlCleanup4: "Validar hreflang i sitemaps.",
    wpmlNoteTitle: "Decisió recomanada",
    wpmlNoteText:
      "Fer servir WPML com a sistema únic d'idiomes. Mantenir una estructura mirall per idioma i evitar barrejar plugins multidioma per no duplicar URLs, menús ni etiquetes SEO.",
    tapeServices: "Serveis.",
    tapeMenu: "Carta.",
    menuTitle: "Menjars, begudes i grups.",
    menuFood: "Menjars",
    menuDrinks: "Begudes",
    menuGroups: "Menú grups",
    tapeLocation: "UBICACIÓ",
    locationTitle: "Ubicació i horaris",
    locationAddress: "Carrer de Llull, 27. 08005 Barcelona",
    openMaps: "Obrir a Google Maps",
    mapTitle: "Mapa de CACHO Poblenou",
    burgersTitle: "Cacho Burgers",
    burgersLead: "Encara no heu vingut a provar les nostres burgers sense postureo?",
    burgersMeet: "Ens veiem a Pujades, 195 · Poblenou",
    altBurgersBrand: "Cacho Burgers",
    miniMenuTitle: "Carta",
    miniMenuText: "Smash burgers, sides i begudes. Enllaç a PDF o pàgina pròpia.",
    miniLocationTitle: "Ubicació",
    miniLocationText: "Adreça del nou local i mapa. Sense horaris, tal com es va demanar.",
    miniDeliveryTitle: "Delivery",
    miniDeliveryText: "Accés directe a plataformes de delivery o comandes pròpies.",
    miniContactTitle: "Contacte",
    miniContactText: "Telèfon, email o WhatsApp específic si en tenen.",
    tapeContact: "CONTACTE",
    tapeContactTitle: "Contacte.",
    contactTitle: "Som aquí.",
    contactText:
      "S'elimina «Què passa a Cacho» i el mapa guanya presència. El formulari queda més genèric i apareix una entrada separada per treballar amb CACHO.",
    formName: "Nom",
    formNamePh: "El teu nom",
    formEmail: "Email",
    formEmailPh: "el@teuemail.com",
    formMessage: "Missatge",
    formMessagePh: "Explica'ns què necessites",
    formSubmit: "Enviar consulta",
    formSending: "Enviant…",
    formSuccess: "Gràcies. Hem rebut el teu missatge i et respondrem aviat.",
    formError: "No s'ha pogut enviar. Torna-ho a provar o escriu-nos a hello@wearecacho.com.",
    formNotConfigured: "Formulari pendent de configurar (Formspree).",
    formSubject: "Consulta web CACHO",
    workWithUs: "Treballa amb nosaltres",
    whatsappAria: "Contactar per WhatsApp",
    footerNetworks: "Xarxes",
    footerSocialInstagram: "Instagram de CACHO",
    footerSocialFacebook: "Facebook de CACHO",
    footerSocialTripadvisor: "Tripadvisor de CACHO",
    footerSitemap: "Mapa del lloc",
    footerHome: "Inici",
    footerReservations: "Reserves",
    footerBusiness: "Empreses",
    footerMenu: "Carta",
    footerLanguages: "Idiomes",
    footerBurgers: "Burgers",
    footerContact: "Contacte",
    footerCookies: "Cookies",
    footerManageCookies: "Gestionar galetes",
    footerLegalCopyright: "CACHO © 2020–2026 TOTS ELS DRETS RESERVATS",
    footerLegalNotice: "Avís legal",
    footerLegalCookies: "Polítiques de galetes",
    cookieSettingsFab: "Ajustos galetes",
    tapeCookies: "GALETES",
    cookiesPolicyTitle: "Política de galetes",
    cookiesPolicyIntro:
      "A CACHO fem servir galetes i tecnologies similars perquè el lloc funcioni, recordar el teu idioma i, si ho autoritzes, mesurar l'ús de la web i les campanyes. Pots canviar la decisió en qualsevol moment amb «Gestionar galetes».",
    cookiesEssentialTitle: "Galetes necessàries",
    cookiesEssentialText:
      "Són imprescindibles per al funcionament bàsic. Inclouen la preferència d'idioma guardada al navegador (localStorage). No requereixen consentiment.",
    cookiesOptionalTitle: "Galetes opcionals",
    cookiesOptionalText: "Només s'activen si les acceptes des del banner o la configuració de galetes.",
    cookiesTableAria: "Taula de galetes",
    cookiesTableName: "Nom / tipus",
    cookiesTableProvider: "Proveïdor",
    cookiesTablePurpose: "Finalitat",
    cookiesTableDuration: "Durada",
    cookiesRowGaName: "Analítica (_ga, _gid…)",
    cookiesRowGaPurpose: "Estadístiques de visites i ús",
    cookiesRowGaDuration: "Fins a 24 mesos",
    cookiesRowMetaName: "Màrqueting (_fbp…)",
    cookiesRowMetaPurpose: "Mesura de campanyes i conversions",
    cookiesRowMetaDuration: "Fins a 90 dies",
    cookiesRowMapsName: "Mapa incrustat",
    cookiesRowMapsPurpose: "Mostrar la ubicació del local",
    cookiesRowMapsDuration: "Segons Google",
    cookiesPolicyNote:
      "Configura a script.js els IDs reals de Google Analytics (GA4) i Meta Pixel abans de publicar.",
    cookieBannerTitle: "Galetes i privacitat",
    cookieBannerText:
      "Fem servir galetes necessàries per a l'idioma i, si ho permets, Google Analytics, Meta Pixel i Google Maps. Pots acceptar-les totes, usar només les necessàries o configurar-les.",
    cookieAcceptAll: "Acceptar totes",
    cookieReject: "Només necessàries",
    cookieCustomize: "Configurar",
    cookieMore: "Política de galetes",
    cookiePrefsTitle: "Preferències de galetes",
    cookiePrefEssential: "Necessàries",
    cookiePrefEssentialDesc: "Idioma i funcionament bàsic del lloc.",
    cookiePrefAnalytics: "Analítica (Google Analytics)",
    cookiePrefAnalyticsDesc: "Ens ajuda a entendre com s'utilitza la web.",
    cookiePrefMarketing: "Màrqueting (Meta Pixel)",
    cookiePrefMarketingDesc: "Mesura campanyes i conversions a xarxes socials.",
    cookiePrefMaps: "Mapa (Google Maps)",
    cookiePrefMapsDesc: "Mostra el mapa d'ubicació incrustat.",
    cookieSave: "Desar preferències",
    cookieBack: "Tornar",
    mapConsentText:
      "El mapa integrat fa servir galetes de Google. Pots activar-lo aquí o obrir la ubicació a Google Maps.",
    mapConsentBtn: "Activar mapa",
    mapOpenExternal: "Obrir a Google Maps"
  },
  en: {
    pageTitle: "CACHO | MVP redesign",
    pageDescription: "Visual MVP for the new CACHO Barcelona site structure.",
    navAria: "Main navigation",
    langSwitcherAria: "Language selector",
    navToggleLabel: "Open menu",
    navToggleClose: "Close menu",
    claim: "homemade and fearless",
    navReservations: "Bookings",
    navBook: "Book",
    navWhat: "What is Cacho",
    navBusiness: "Services",
    navMenu: "Menu",
    navLocation: "Location",
    navContact: "Contact",
    navLanguages: "Languages",
    navBurgers: "Cacho Burgers",
    heroAria: "CACHO home",
    heroCartelLine1: "Book your table with",
    heroCartelLine2: "just one click",
    bookTable: "Book a table",
    viewLocation: "View location",
    tapeReservations: "BOOKINGS",
    bookingTitle: "The main action, visible on mobile.",
    bookingText:
      "The redesign makes booking the natural first path. The button appears in key areas and stays fixed as a quick mobile action.",
    bookNow: "Book now",
    bookingArea: "Poblenou",
    hoursMonWed: "Mon-Wed: 12:30pm - 11pm",
    hoursThuFri: "Thu-Fri: 12:30pm - 12am",
    hoursWeekend: "Weekend: 12pm - 11:30pm",
    productsAria: "What we serve",
    tapeProducts: "What do we do?",
    productsTitle: "Dishes, burgers, meats and afterwork.",
    productsText:
      "We serve HOMEMADE, FEARLESS FOOD — no fuss, but mindful of what’s around us, cooked in-house every day with fresh, unprocessed ingredients. Our offer ranges from healthy everyday dishes to meats in true Argentine style, sandwiches, burgers and salads. Desserts from grandma’s original recipe, fresh juices and cocktails with the best combinations.\n\nWe have a different CACHO for every moment, split into three groups: cacho plato, Dinner and Brunch.",
    altBurger: "CACHO burger",
    altDish: "CACHO dish",
    altBeer: "CACHO beer",
    aboutTitle: "What is Cacho",
    altAbout: "CACHO team and atmosphere",
    aboutText1:
      "We are CACHO and we came to Poblenou to create a different space where neighbours can find homemade, quality food, draught beer and a great vibe on the biggest terrace in @22.",
    aboutText2:
      "Come say hi — we (almost) never bite — and we've got CACHO whenever you want it: meals, after work and weekend brunch. We already said we're fearless 😉",
    cateringTitle: "Catering, Cacho Plato and After Work & Dinner.",
    cateringCard1Title: "Cacho Catering",
    cateringCard1Text1:
      "If you have an event, we take care of the flavour. With Cacho Catering, we make it easy: quality, great produce and the Cacho touch your event deserves.",
    cateringCard1Text2:
      "For companies, celebrations and any special occasion. Get in touch and we'll make it happen. 💬 HELLO@WEARECACHO.COM",
    cateringCard2Title: "Cacho Plato",
    cateringCard2Text1:
      "Come in, grab your plate and choose from our different pre-cooked options. Meats and veggie sides with the best seasonal produce. A healthy option that won't take much time out of your busy day — and it's affordable too.",
    cateringCard2Text2:
      "The options change every two weeks — our perfect formula runs Monday to Friday from 12:30pm to 4pm.",
    cateringCard3Title: "After Work & Dinner",
    cateringCard3Text1:
      "Ending the day and going home isn't the same as Cacho's afterwork — we'll tell you why: you get to that Poblenou corner, there's great music, you order your first beer and pair it with our potatoes and chipotle sauce because you've earned it.",
    cateringCard3Text2:
      "Your friends start arriving and when our server comes by for round two, you know you're going to end up having dinner right there.",
    cateringCard3Text3:
      "A wide range of options: Smash Burger, Argentine meats, milanesas, sandwiches, nachos, vegan options and more.",
    tapeLanguages: "LANGUAGES / WPML",
    languagesTitle: "A base page and its SEO translations per language.",
    languagesText:
      "With WPML, each important page is translated as an equivalent page in Spanish, Catalan and English. The selector leads to the right version, with its own URL, translated slugs, metadata and hreflang.",
    wpmlGridAria: "Proposed WPML structure",
    wpmlHome: "Home",
    wpmlReservations: "Bookings",
    wpmlAbout: "What is Cacho",
    wpmlCatering: "Company catering",
    wpmlMenu: "Menu",
    wpmlBurgers: "Cacho Burgers",
    wpmlAboutEs: "home block",
    wpmlAboutCa: "home block",
    wpmlAboutEn: "home block",
    wpmlCleanup1: "Migrate from Polylang to WPML.",
    wpmlCleanup2: "Remove duplicates and drafts.",
    wpmlCleanup3: "Translate slugs and SEO meta.",
    wpmlCleanup4: "Validate hreflang and sitemaps.",
    wpmlNoteTitle: "Recommended decision",
    wpmlNoteText:
      "Use WPML as the single language system. Keep a mirror structure per language and avoid mixing multilingual plugins so URLs, menus and SEO tags are not duplicated.",
    tapeServices: "Services.",
    tapeMenu: "Menu.",
    menuTitle: "Food, drinks and groups.",
    menuFood: "Food",
    menuDrinks: "Drinks",
    menuGroups: "Group menu",
    tapeLocation: "LOCATION",
    locationTitle: "Location and opening hours",
    locationAddress: "Carrer de Llull, 27. 08005 Barcelona",
    openMaps: "Open in Google Maps",
    mapTitle: "CACHO Poblenou map",
    burgersTitle: "Cacho Burgers",
    burgersLead: "Still haven't come to try our no-posture burgers?",
    burgersMeet: "See you at Pujades, 195 · Poblenou",
    altBurgersBrand: "Cacho Burgers",
    miniMenuTitle: "Menu",
    miniMenuText: "Smash burgers, sides and drinks. Link to PDF or dedicated page.",
    miniLocationTitle: "Location",
    miniLocationText: "New venue address and map. No opening hours, as requested.",
    miniDeliveryTitle: "Delivery",
    miniDeliveryText: "Direct access to delivery platforms or own orders.",
    miniContactTitle: "Contact",
    miniContactText: "Phone, email or dedicated WhatsApp if available.",
    tapeContact: "CONTACT",
    tapeContactTitle: "Contact.",
    contactTitle: "We are here.",
    contactText:
      "“What’s on at Cacho” is removed and the map gains prominence. The form is more generic and a separate entry appears for working with CACHO.",
    formName: "Name",
    formNamePh: "Your name",
    formEmail: "Email",
    formEmailPh: "you@email.com",
    formMessage: "Message",
    formMessagePh: "Tell us what you need",
    formSubmit: "Send enquiry",
    formSending: "Sending…",
    formSuccess: "Thank you. We received your message and will reply soon.",
    formError: "Could not send. Please try again or email hello@wearecacho.com.",
    formNotConfigured: "Form pending setup (Formspree).",
    formSubject: "CACHO website enquiry",
    workWithUs: "Work with us",
    whatsappAria: "Contact via WhatsApp",
    footerNetworks: "Social",
    footerSocialInstagram: "CACHO on Instagram",
    footerSocialFacebook: "CACHO on Facebook",
    footerSocialTripadvisor: "CACHO on Tripadvisor",
    footerSitemap: "Sitemap",
    footerHome: "Home",
    footerReservations: "Bookings",
    footerBusiness: "Companies",
    footerMenu: "Menu",
    footerLanguages: "Languages",
    footerBurgers: "Burgers",
    footerContact: "Contact",
    footerCookies: "Cookies",
    footerManageCookies: "Manage cookies",
    footerLegalCopyright: "CACHO © 2020–2026 ALL RIGHTS RESERVED",
    footerLegalNotice: "Legal notice",
    footerLegalCookies: "Cookie policy",
    cookieSettingsFab: "Cookie settings",
    tapeCookies: "COOKIES",
    cookiesPolicyTitle: "Cookie policy",
    cookiesPolicyIntro:
      "At CACHO we use cookies and similar technologies so the site works, remembers your language and, if you allow it, measures site usage and campaigns. You can change your choice anytime via «Manage cookies».",
    cookiesEssentialTitle: "Necessary cookies",
    cookiesEssentialText:
      "These are required for basic operation. They include your language preference stored in the browser (localStorage). They do not require consent.",
    cookiesOptionalTitle: "Optional cookies",
    cookiesOptionalText: "These are only activated if you accept them from the banner or cookie settings.",
    cookiesTableAria: "Cookie table",
    cookiesTableName: "Name / type",
    cookiesTableProvider: "Provider",
    cookiesTablePurpose: "Purpose",
    cookiesTableDuration: "Duration",
    cookiesRowGaName: "Analytics (_ga, _gid…)",
    cookiesRowGaPurpose: "Visit and usage statistics",
    cookiesRowGaDuration: "Up to 24 months",
    cookiesRowMetaName: "Marketing (_fbp…)",
    cookiesRowMetaPurpose: "Campaign and conversion measurement",
    cookiesRowMetaDuration: "Up to 90 days",
    cookiesRowMapsName: "Embedded map",
    cookiesRowMapsPurpose: "Show the venue location",
    cookiesRowMapsDuration: "Per Google",
    cookiesPolicyNote:
      "Set your real Google Analytics (GA4) and Meta Pixel IDs in script.js before going live.",
    cookieBannerTitle: "Cookies and privacy",
    cookieBannerText:
      "We use necessary cookies for language and, if you allow, Google Analytics, Meta Pixel and Google Maps. You can accept all, use only necessary ones, or configure them.",
    cookieAcceptAll: "Accept all",
    cookieReject: "Necessary only",
    cookieCustomize: "Configure",
    cookieMore: "Cookie policy",
    cookiePrefsTitle: "Cookie preferences",
    cookiePrefEssential: "Necessary",
    cookiePrefEssentialDesc: "Language and basic site operation.",
    cookiePrefAnalytics: "Analytics (Google Analytics)",
    cookiePrefAnalyticsDesc: "Helps us understand how the site is used.",
    cookiePrefMarketing: "Marketing (Meta Pixel)",
    cookiePrefMarketingDesc: "Measures campaigns and social conversions.",
    cookiePrefMaps: "Map (Google Maps)",
    cookiePrefMapsDesc: "Shows the embedded location map.",
    cookieSave: "Save preferences",
    cookieBack: "Back",
    mapConsentText:
      "The embedded map uses Google cookies. You can enable it here or open the location in Google Maps.",
    mapConsentBtn: "Enable map",
    mapOpenExternal: "Open in Google Maps"
  }
};

function applyTranslations(dictionary) {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (!dictionary[key]) return;
    node.textContent = dictionary[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (dictionary[key]) node.placeholder = dictionary[key];
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const key = node.dataset.i18nAria;
    if (dictionary[key]) node.setAttribute("aria-label", dictionary[key]);
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    const key = node.dataset.i18nAlt;
    if (dictionary[key]) node.alt = dictionary[key];
  });

  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    const key = node.dataset.i18nTitle;
    if (dictionary[key]) node.title = dictionary[key];
  });

  if (dictionary.pageTitle) document.title = dictionary.pageTitle;

  const meta = document.querySelector('meta[name="description"]');
  if (meta && dictionary.pageDescription) {
    meta.content = dictionary.pageDescription;
  }
}

function getNavSections() {
  return navSectionLinks
    .map((link) => {
      const selector = link.getAttribute("href");
      const el = selector ? document.querySelector(selector) : null;
      if (!el) return null;
      return { link, el };
    })
    .filter(Boolean);
}

function applyActiveNavLink(activeLink) {
  if (!activeLink) return;
  navSectionLinks.forEach((link) => {
    const isActive = link === activeLink;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function getNavScrollOffset() {
  const headerHeight = header ? header.offsetHeight : 0;
  const scrollPadding = parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop
  );
  if (Number.isFinite(scrollPadding) && scrollPadding > 0) return scrollPadding;
  return headerHeight + 12;
}

function getNavScrollTarget(el) {
  if (!el) return null;
  return (
    el.querySelector(":scope > h2, :scope > .menu-section__title") || el
  );
}

function getSectionPageTop(el) {
  const target = getNavScrollTarget(el);
  return target.getBoundingClientRect().top + window.scrollY;
}

function scrollToNavSection(selector, { behavior = "smooth", updateHash = true } = {}) {
  if (!selector || !selector.startsWith("#")) return;

  const section = document.querySelector(selector);
  if (!section) return;

  const offset = getNavScrollOffset();
  const target = getNavScrollTarget(section);
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);

  if (updateHash && window.location.hash !== selector) {
    history.pushState(null, "", selector);
  }

  window.scrollTo({ top, behavior });
}

function setActiveLink() {
  if (!navSectionLinks.length) return;

  const sections = getNavSections().sort(
    (a, b) => getSectionPageTop(a.el) - getSectionPageTop(b.el)
  );
  if (!sections.length) return;

  const scrollPos = window.scrollY + getNavScrollOffset();
  let active = sections[0];

  sections.forEach((section) => {
    if (getSectionPageTop(section.el) <= scrollPos + 1) active = section;
  });

  applyActiveNavLink(active.link);
}

function initNavScrollSpy() {
  let scrollSpyFrame = 0;
  let scrollEndTimer = 0;

  const scheduleScrollSpy = () => {
    cancelAnimationFrame(scrollSpyFrame);
    scrollSpyFrame = requestAnimationFrame(setActiveLink);
    clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(setActiveLink, 160);
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  navSectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      if (!selector || !selector.startsWith("#")) return;

      event.preventDefault();
      applyActiveNavLink(link);
      scrollToNavSection(selector, {
        behavior: prefersReducedMotion ? "auto" : "smooth",
        updateHash: true,
      });
      scheduleScrollSpy();
      window.setTimeout(setActiveLink, prefersReducedMotion ? 0 : 450);
    });
  });

  window.addEventListener("scroll", scheduleScrollSpy, { passive: true });
  window.addEventListener("resize", setActiveLink, { passive: true });
  window.addEventListener("hashchange", () => {
    const link = navSectionLinks.find((item) => item.getAttribute("href") === window.location.hash);
    if (link) {
      applyActiveNavLink(link);
      scrollToNavSection(window.location.hash, {
        behavior: "auto",
        updateHash: false,
      });
    }
    scheduleScrollSpy();
    window.setTimeout(setActiveLink, 80);
  });
  window.addEventListener("load", () => {
    const hash = window.location.hash;
    if (hash) {
      const link = navSectionLinks.find((item) => item.getAttribute("href") === hash);
      if (link) {
        applyActiveNavLink(link);
        scrollToNavSection(hash, { behavior: "auto", updateHash: false });
      }
    }
    scheduleScrollSpy();
    window.setTimeout(setActiveLink, 120);
  });
}

initNavScrollSpy();

function setNavOpen(isOpen) {
  if (!navToggle || !navMenu) return;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  const lang = document.body.dataset.lang || "es";
  const dictionary = translations[lang] || translations.es;
  navToggle.setAttribute(
    "aria-label",
    isOpen ? dictionary.navToggleClose : dictionary.navToggleLabel
  );
}

function closeNav() {
  setNavOpen(false);
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!isOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));
  if (mobileCta) mobileCta.addEventListener("click", closeNav);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeNav();
  });
}

function resolveInitialLanguage() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored && translations[stored]) return stored;

  const browser = (navigator.language || "es").slice(0, 2).toLowerCase();
  if (translations[browser]) return browser;
  return "es";
}

function setLanguage(lang) {
  const dictionary = translations[lang] || translations.es;
  document.documentElement.lang = lang;
  document.body.dataset.lang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);

  applyTranslations(dictionary);
  if (typeof applyMenuContent === "function") applyMenuContent(lang);

  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });

  if (navToggle) {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute(
      "aria-label",
      isOpen ? dictionary.navToggleClose : dictionary.navToggleLabel
    );
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

setLanguage(resolveInitialLanguage());

function initReveal() {
  const sections = document.querySelectorAll("main section:not(.hero):not(.parallax-band)");

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

initReveal();

function initParallax() {
  const bands = [...document.querySelectorAll(".parallax-band")];
  if (!bands.length) return;

  const mq = window.matchMedia("(max-width: 980px)");
  const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let rafId = 0;
  let listenersAttached = false;

  const update = () => {
    rafId = 0;
    if (!mq.matches || motionMq.matches) return;

    const vh = window.innerHeight;
    bands.forEach((band) => {
      const bg = band.querySelector(".parallax-band__bg");
      if (!bg) return;

      const rect = band.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > vh + 80) return;

      const centerOffset = rect.top + rect.height * 0.5 - vh * 0.5;
      const translate = centerOffset * -0.42;
      bg.style.transform = `translate3d(0, ${translate}px, 0)`;
    });
  };

  const scheduleUpdate = () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  };

  const clearTransforms = () => {
    bands.forEach((band) => {
      const bg = band.querySelector(".parallax-band__bg");
      if (bg) bg.style.transform = "";
    });
  };

  const syncMode = () => {
    const useJs = mq.matches && !motionMq.matches;
    document.documentElement.classList.toggle("parallax-js", useJs);

    if (useJs) {
      if (!listenersAttached) {
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate, { passive: true });
        listenersAttached = true;
      }
      scheduleUpdate();
      return;
    }

    clearTransforms();
    if (listenersAttached) {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      listenersAttached = false;
    }
  };

  mq.addEventListener("change", syncMode);
  motionMq.addEventListener("change", syncMode);
  window.addEventListener("load", scheduleUpdate);
  syncMode();
}

initParallax();

function initMobileBottomBarDock() {
  const bar = document.querySelector(".mobile-bottom-bar");
  const legal = document.querySelector(".footer-legal-bar");
  if (!bar || !legal) return;

  const mq = window.matchMedia("(max-width: 620px)");
  const cookieBanner = document.getElementById("cookie-banner");
  let rafId = 0;

  const getSafeBottom = () => {
    const value = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--safe-bottom")
    );
    return Number.isFinite(value) ? value : 0;
  };

  const getBaseBottom = () => {
    let base = 12 + getSafeBottom();

    if (
      document.body.classList.contains("cookie-banner-open") &&
      cookieBanner &&
      !cookieBanner.hidden
    ) {
      const bannerRect = cookieBanner.getBoundingClientRect();
      base = Math.max(base, window.innerHeight - bannerRect.top + 12);
    }

    return base;
  };

  const update = () => {
    rafId = 0;
    if (!mq.matches) {
      bar.style.removeProperty("bottom");
      return;
    }

    const vh = window.innerHeight;
    const legalTop = legal.getBoundingClientRect().top;
    const gap = 10;
    const dockBottom = vh - legalTop + gap;
    const bottomPx = Math.max(getBaseBottom(), dockBottom);

    bar.style.bottom = `${bottomPx}px`;
  };

  const schedule = () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  };

  mq.addEventListener("change", schedule);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("load", schedule);

  const bodyObserver = new MutationObserver(schedule);
  bodyObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  if (cookieBanner) {
    const bannerObserver = new MutationObserver(schedule);
    bannerObserver.observe(cookieBanner, {
      attributes: true,
      attributeFilter: ["hidden"],
    });
  }

  schedule();
}

initMobileBottomBarDock();

function initMenuPageLinks() {
  document.querySelectorAll(".js-menu-page").forEach((link) => {
    const rawHref = link.getAttribute("href");
    if (!rawHref || rawHref.startsWith("http")) return;

    const targetUrl = new URL(rawHref, window.location.href).href;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.assign(targetUrl);
    });
  });
}

initMenuPageLinks();

/* --- Cookies y tracking (GA4, Meta Pixel, Maps) --- */
const COOKIE_CONSENT_KEY = "cacho-cookie-consent";
const COOKIE_CONSENT_VERSION = 1;

/** Sustituye por tus IDs reales antes de publicar (vacío = no carga el script). */
const TRACKING_CONFIG = {
  gaMeasurementId: "",
  metaPixelId: "",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Carrer%20de%20Llull%2027%20Barcelona&output=embed"
};

const cookieBanner = document.getElementById("cookie-banner");
const mapPlaceholder = document.querySelector("[data-map-placeholder]");
const mapIframe = document.querySelector("[data-map-iframe]");
const cookiePrefInputs = [...document.querySelectorAll("[data-cookie-pref]")];
const cookieManageButtons = [...document.querySelectorAll("[data-cookie-manage]")];
const mapEnableButton = document.querySelector("[data-map-enable]");

let trackingLoaded = { analytics: false, marketing: false };

function isValidGaId(id) {
  const value = String(id || "").trim();
  if (!/^G-[A-Z0-9]+$/i.test(value)) return false;
  return !/X{4,}/i.test(value);
}

function isValidMetaPixelId(id) {
  const value = String(id || "").trim();
  return /^\d{10,}$/.test(value) && !/^0+$/.test(value);
}

function defaultConsent() {
  return {
    v: COOKIE_CONSENT_VERSION,
    essential: true,
    analytics: false,
    marketing: false,
    maps: false,
    updatedAt: Date.now()
  };
}

function allOptionalConsent() {
  return {
    v: COOKIE_CONSENT_VERSION,
    essential: true,
    analytics: true,
    marketing: true,
    maps: true,
    updatedAt: Date.now()
  };
}

function readConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== COOKIE_CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(consent) {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
}

function syncPrefCheckboxes(consent) {
  cookiePrefInputs.forEach((input) => {
    const key = input.dataset.cookiePref;
    input.checked = Boolean(consent[key]);
  });
}

function readPrefsFromForm() {
  const consent = defaultConsent();
  cookiePrefInputs.forEach((input) => {
    const key = input.dataset.cookiePref;
    if (key in consent) consent[key] = input.checked;
  });
  consent.updatedAt = Date.now();
  return consent;
}

function showCookieView(view) {
  if (!cookieBanner) return;
  cookieBanner.querySelectorAll("[data-cookie-view]").forEach((panel) => {
    const isTarget = panel.dataset.cookieView === view;
    panel.hidden = !isTarget;
  });
}

function openCookieBanner(view = "main") {
  if (!cookieBanner) return;
  const consent = readConsent();
  if (consent) syncPrefCheckboxes(consent);
  showCookieView(view);
  cookieBanner.removeAttribute("hidden");
  document.body.classList.add("cookie-banner-open");
}

function closeCookieBanner() {
  if (!cookieBanner) return;
  cookieBanner.setAttribute("hidden", "");
  document.body.classList.remove("cookie-banner-open");
}

function loadGoogleAnalytics() {
  const id = TRACKING_CONFIG.gaMeasurementId;
  if (!isValidGaId(id) || trackingLoaded.analytics) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id, { anonymize_ip: true });

  trackingLoaded.analytics = true;
}

function loadMetaPixel() {
  const id = TRACKING_CONFIG.metaPixelId;
  if (!isValidMetaPixelId(id) || trackingLoaded.marketing) return;

  if (!window.fbq) {
    const n = (window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq("init", id);
  window.fbq("track", "PageView");
  trackingLoaded.marketing = true;
}

function enableEmbeddedMap() {
  if (!mapIframe || !mapPlaceholder) return;
  const wrap = mapIframe.closest(".map-wrap");
  const src = mapIframe.dataset.src || TRACKING_CONFIG.mapsEmbedUrl;
  if (!mapIframe.src) mapIframe.src = src;
  mapIframe.hidden = false;
  mapPlaceholder.hidden = true;
  wrap?.classList.add("is-map-active");
}

function disableEmbeddedMap() {
  if (!mapIframe || !mapPlaceholder) return;
  const wrap = mapIframe.closest(".map-wrap");
  mapIframe.removeAttribute("src");
  mapIframe.hidden = true;
  mapPlaceholder.hidden = false;
  wrap?.classList.remove("is-map-active");
}

function applyConsent(consent) {
  if (consent.analytics) loadGoogleAnalytics();
  if (consent.marketing) loadMetaPixel();
  if (consent.maps) enableEmbeddedMap();
  else disableEmbeddedMap();
}

function saveAndApplyConsent(consent, closeBanner = true) {
  writeConsent(consent);
  applyConsent(consent);
  if (closeBanner) closeCookieBanner();
}

function initCookieConsent() {
  const existing = readConsent();
  if (existing) {
    syncPrefCheckboxes(existing);
    applyConsent(existing);
    return;
  }

  openCookieBanner("main");
}

if (cookieBanner) {
  cookieBanner.addEventListener("click", (event) => {
    const action = event.target.closest("[data-cookie-action]");
    if (!action) return;

    const type = action.dataset.cookieAction;
    if (type === "accept-all") {
      saveAndApplyConsent(allOptionalConsent());
      return;
    }
    if (type === "reject") {
      saveAndApplyConsent(defaultConsent());
      return;
    }
    if (type === "open-prefs") {
      syncPrefCheckboxes(readConsent() || defaultConsent());
      showCookieView("prefs");
      return;
    }
    if (type === "back") {
      showCookieView("main");
      return;
    }
    if (type === "save-prefs") {
      saveAndApplyConsent(readPrefsFromForm());
    }
  });

  cookieBanner.querySelector('a[href="./politica-cookies.html"]')?.addEventListener("click", () => {
    closeCookieBanner();
  });
}

cookieManageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openCookieBanner(readConsent() ? "prefs" : "main");
  });
});

mapEnableButton?.addEventListener("click", () => {
  const consent = readConsent() || defaultConsent();
  consent.maps = true;
  consent.updatedAt = Date.now();
  saveAndApplyConsent(consent, false);
  syncPrefCheckboxes(consent);
});

initCookieConsent();

const contactForm = document.querySelector(".contact-form");

function getActiveDictionary() {
  const lang = document.body.dataset.lang || "es";
  return translations[lang] || translations.es;
}

function getFormspreeFormId() {
  const fromData = contactForm?.dataset.formspreeId?.trim();
  if (fromData && fromData !== "YOUR_FORM_ID") return fromData;
  if (FORMSPREE_FORM_ID && FORMSPREE_FORM_ID !== "YOUR_FORM_ID") return FORMSPREE_FORM_ID;
  return "";
}

function setContactFormStatus(message, type) {
  const status = contactForm?.querySelector(".contact-form__status");
  if (!status) return;
  status.textContent = message || "";
  status.hidden = !message;
  status.classList.remove("is-success", "is-error");
  if (type === "success") status.classList.add("is-success");
  if (type === "error") status.classList.add("is-error");
}

async function handleContactFormSubmit(event) {
  event.preventDefault();
  if (!contactForm) return;

  const dictionary = getActiveDictionary();
  const formId = getFormspreeFormId();

  if (!formId) {
    setContactFormStatus(dictionary.formNotConfigured, "error");
    return;
  }

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);
  formData.set("_subject", dictionary.formSubject);

  if (submitButton) submitButton.disabled = true;
  setContactFormStatus(dictionary.formSending, null);

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      setContactFormStatus(dictionary.formSuccess, "success");
      contactForm.reset();
      return;
    }

    const payload = await response.json().catch(() => null);
    const detail =
      payload?.errors?.map((item) => item.message).filter(Boolean).join(" ") ||
      dictionary.formError;
    setContactFormStatus(detail, "error");
  } catch {
    setContactFormStatus(dictionary.formError, "error");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

if (contactForm) {
  const formId = getFormspreeFormId();
  if (formId) {
    contactForm.action = `https://formspree.io/f/${formId}`;
  }
  contactForm.addEventListener("submit", handleContactFormSubmit);
}
