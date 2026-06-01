# Carta CACHO en Google Sheets (ES · CA · EN)

La web ya tiene selector **ES / CA / EN**. La hoja debe reflejar eso: **cada texto visible de la carta en tres columnas** (español, catalán, inglés). Los precios son únicos (no cambian por idioma).

---

## Tu primer paso (ahora)

1. [Google Sheets](https://sheets.google.com) → hoja en blanco → nombre: **CACHO — Cartas**.
2. Creá **6 pestañas** (nombres exactos):

| Pestaña | Contenido |
|---------|-----------|
| `Comidas` | Platos, precios, descripciones × 3 idiomas |
| `Bebidas` | Igual |
| `Menú Grupos` | Ítems de menús de grupo × 3 idiomas |
| `Cacho Burgers` | Carta smash burgers × 3 idiomas |
| `Secciones` | Títulos de bloque, notas, subtítulos de vinos × 3 idiomas |
| `Horarios` | Líneas de horario de apertura × 3 idiomas (home) |

3. Importá los CSV de `docs/google-sheets/` (Archivo → Importar → una pestaña cada vez):

| CSV | Pestaña |
|-----|---------|
| `Comidas.csv` | Comidas |
| `Bebidas.csv` | Bebidas |
| `Menu-Grupos.csv` | Menú Grupos |
| `Cacho-Burgers.csv` | Cacho Burgers |
| `Secciones.csv` | Secciones |
| `Horarios.csv` | Horarios |

Al importar: **Reemplazar datos en la hoja seleccionada** + separador **Coma**. Nunca «Reemplazar hoja de cálculo» (borra las otras pestañas).

Tras importar `Cacho-Burgers.csv`, comprobá una fila sin descripción (ej. `cb_fries`): columna **J** = `price`, columna **M** = `TRUE` en `active`, columna **L** `mark` vacía.

**Menú Grupos:** la pestaña debe incluir la columna **`group`** (entre `section` y `order`). Sin ella, el menú completo no aparece en la web. Valores: `starter`, `main`, `dessert`, `drink` para filas `gr_starter*`, `gr_main*`, etc.; vacío para `gr_pp*` (pica pica). Si tu hoja es antigua, reimportá `Menu-Grupos.csv` del repo (incluye `group`).

**Burgers vacías en Comidas (solo sale el cartel «BURGERS»):** en la pestaña **Comidas**, columna `section`, las filas `provoloneBurger` … `cheeseBacon` y los `extra*` deben decir **`burgers`**, no `milanese`. Corregilo a mano o **reimportá solo** `docs/google-sheets/Comidas.csv` → pestaña **Comidas** (reemplazar datos en la hoja). El CSV del repo ya trae `burgers` bien; no hace falta tocar `comidas.html` para los platos.

4. Avisame con la **URL de la hoja** para el Apps Script y conectar la web.

---

## Cómo carga la web (100 % dinámico)

Las páginas de carta (`comidas`, `bebidas`, `menu-grupos`, `cacho-burgers`) tienen **listas vacías** en el HTML (`<ul data-menu-list="…">`). Al cargar, `menu-sheet.js` + `menu-render.js` leen Google Sheets y **generan cada plato** (nombre, descripción, precio). No hay textos de platos en el código.

- Títulos, notas y subtítulos → pestaña **Secciones**
- Platos y precios → pestaña correspondiente (**Comidas**, **Bebidas**, etc.)
- Horarios → pestaña **Horarios**

Hasta que Sheets responde, los bloques de carta permanecen ocultos y se muestra un indicador de carga (`menu-sheet-pending` + `.menu-sheet-loading`).

---

## Columnas de platos (Comidas / Bebidas / Menú Grupos / Cacho Burgers)

```
id | section | group | order | name_es | name_ca | name_en | desc_es | desc_ca | desc_en | price | price2 | mark | active
```

| Columna | Uso |
|---------|-----|
| `section` | Bloque de la carta (`salads`, `wine`, `burgers`, `full`, `fries`, …). En **Comidas**, las burgers del menú dinner deben ser `burgers`, no `milanese` (ver `docs/google-sheets/Comidas.csv`). |
| `group` | Sublista dentro del bloque (ver abajo). Vacío si no aplica. |
| `name_es` / `name_ca` / `name_en` | Nombre del plato en cada idioma |
| `desc_es` / `desc_ca` / `desc_en` | Descripción (vacío si no hay) |
| `price` / `price2` | Precio(s) — **mismos en todos los idiomas** (simple / doble en burgers) |
| `mark` | Ej. `*` vegetariano |
| `active` | `TRUE` / `FALSE` — oculta la fila si es `FALSE` |

### Ejemplos de `group`

| section | group | Ejemplo |
|---------|-------|---------|
| `wine` | `red`, `white`, `cava`, … | Vinos por color / tipo |
| `spirits` | `gin`, `vodka`, … | Combinados por categoría |
| `coffee` | `coffee` | Cafés de especialidad |
| `coffee` | `refresh` | Refrescos caseros |
| `burgers` | `extras` | Extras “Tunea tu burger” (comidas) |
| `full` | `starter`, `main`, `dessert`, `drink` | Menú de grupos |
| `fries` / `addons` | `extras` | Extras Cacho Burgers |

**Cacho Burgers — combo:** fila `combo_addon` en sección `combo`, columna `price` = suplemento del combo (la web muestra `+4`).

**Al editar:** si cambias un plato en español, revisa también catalán e inglés en la misma fila. Para regenerar CSV desde el repo: `node scripts/export-menu-to-csv.mjs`.

---

## Columnas de secciones (pestaña Secciones)

```
page | section | field | text_es | text_ca | text_en
```

Ejemplos:

| page | section | field | Qué es |
|------|---------|-------|--------|
| `dinner` | `salads` | `title` | Título "Ensaladas" / "Amanides" / "Salads" |
| `dinner` | `salads` | `note` | Nota bajo el título |
| `drinks` | `wine` | `subtitle_red` | Subtítulo "Tintos" en carta de vinos |
| `groups` | `full` | `mainTitle` | "Plato fuerte con acompañamiento…" |

La web elegirá `text_es`, `text_ca` o `text_en` según el botón ES / CA / EN (igual que ahora con `applyMenuContent`).

---

## Columnas de horarios (pestaña Horarios)

Usada en la home, bloque **Ubicación y horarios** (debajo del mapa).

```
key | scope | order | text_es | text_ca | text_en | active
```

| scope | Dónde se ve |
|-------|-------------|
| `home` | Home → Ubicación y horarios (Llull 27) |
| `burgers` | Página [cacho-burgers.html](cacho-burgers.html) (Pujades 195) |

Mismas claves en cada scope:

| key | Línea |
|-----|--------|
| `hoursMonWed` | Primera línea |
| `hoursThuFri` | Segunda línea |
| `hoursWeekend` | Tercera línea |

Editá el texto completo de cada línea en los tres idiomas (incluida la etiqueta del día, p. ej. «Lun-mié:»). Podés poner horarios distintos en `home` y `burgers`. Si falta la columna `scope`, la fila se trata como `home`.

Para ocultar una línea sin borrarla: `active` = `FALSE`.

---

## Regenerar CSV desde el código

```bash
node scripts/export-menu-to-csv.mjs
```

---

## Paso 2: Apps Script

1. **Extensiones → Apps Script** → pegar `docs/google-sheets/apps-script.gs`.
2. **Implementar → Aplicación web** → acceso **Cualquier persona**.
3. La URL `/exec` devuelve JSON con `comidas`, `bebidas`, `grupos`, `cachoBurgers`, `secciones` y `horarios` (todo multidioma).
4. Si cambiás el script, **Implementar → Administrar implementaciones → editar → Nueva versión** (la web usa la versión publicada).

**Importante:** Tras añadir soporte JSONP al script, volvé a publicar una **nueva versión** de la implementación.

---

## Paso 3: Web (en el repo)

1. Abrí `menu-sheet-config.js` en el proyecto.
2. Pegá la URL `/exec` en `window.CACHO_MENU_SHEET_URL = "..."`.
3. Subí los cambios al hosting.

`menu-sheet.js` hace algo equivalente a:

```javascript
const lang = document.documentElement.lang.slice(0, 2); // es | ca | en
item.name = row[`name_${lang}`] || row.name_es;
item.desc = row[`desc_${lang}`] || row.desc_es;
section.title = sec[`text_${lang}`] || sec.text_es;
```

Los textos de navegación (Reservar, Contacto, etc.) siguen en `menu-i18n.js` / `script.js`. Desde Sheets salen **la carta** y los **tres renglones de horario** de la home.

---

## Reglas para quien edita

| Regla | Motivo |
|-------|--------|
| Tres columnas de nombre y descripción | La web muestra ES, CA o EN |
| No borrar filas | `active` = `FALSE` |
| No cambiar `id` | Clave estable |
| Precios una sola vez | No hay `price_en` |

### Claves `section`

**Comidas:** `salads`, `share`, `grill`, `milanese`, `burgers`, `sandwiches`, `desserts`  
**Bebidas:** `cocktails`, `beer`, `zero`, `wine`, `spirits`, `coffee`  
**Grupos:** `full`, `pica`

**Cacho Burgers:** `fries`, `cookies`, `burgers`, `combo`, `addons`, `kids`
