# Carta CACHO en Google Sheets (ES · CA · EN)

La web ya tiene selector **ES / CA / EN**. La hoja debe reflejar eso: **cada texto visible de la carta en tres columnas** (español, catalán, inglés). Los precios son únicos (no cambian por idioma).

---

## Tu primer paso (ahora)

1. [Google Sheets](https://sheets.google.com) → hoja en blanco → nombre: **CACHO — Cartas**.
2. Creá **4 pestañas** (nombres exactos):

| Pestaña | Contenido |
|---------|-----------|
| `Comidas` | Platos, precios, descripciones × 3 idiomas |
| `Bebidas` | Igual |
| `Menú Grupos` | Ítems de menús de grupo × 3 idiomas |
| `Secciones` | Títulos de bloque, notas, subtítulos de vinos × 3 idiomas |

3. Importá los CSV de `docs/google-sheets/` (Archivo → Importar → una pestaña cada vez):

| CSV | Pestaña |
|-----|---------|
| `Comidas.csv` | Comidas |
| `Bebidas.csv` | Bebidas |
| `Menu-Grupos.csv` | Menú Grupos |
| `Secciones.csv` | Secciones |

4. Avisame con la **URL de la hoja** para el Apps Script y conectar la web.

---

## Columnas de platos (Comidas / Bebidas / Menú Grupos)

```
id | section | order | name_es | name_ca | name_en | desc_es | desc_ca | desc_en | price | price2 | mark | active
```

| Columna | Uso |
|---------|-----|
| `name_es` / `name_ca` / `name_en` | Nombre del plato en cada idioma |
| `desc_es` / `desc_ca` / `desc_en` | Descripción (vacío si no hay) |
| `price` / `price2` | Precio(s) — **mismos en todos los idiomas** |
| `mark` | Ej. `*` vegetariano |

**Al editar:** si cambias un plato en español, revisa también catalán e inglés en la misma fila. Los CSV exportados ya traen los tres idiomas desde `menu-i18n.js`.

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

## Regenerar CSV desde el código

```bash
node scripts/export-menu-to-csv.mjs
```

---

## Paso 2: Apps Script

1. **Extensiones → Apps Script** → pegar `docs/google-sheets/apps-script.gs`.
2. **Implementar → Aplicación web** → acceso **Cualquier persona**.
3. La URL `/exec` devuelve JSON con `comidas`, `bebidas`, `grupos` y `secciones` (todo multidioma).
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

Los textos de navegación (Reservar, Contacto, etc.) siguen en `menu-i18n.js` / `script.js`; **solo la carta** sale de Sheets.

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
