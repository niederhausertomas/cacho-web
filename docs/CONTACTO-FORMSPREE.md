# Formulario de contacto → hello@wearecacho.com

La web envía el formulario de la home con **Formspree** (gratis hasta ~50 envíos/mes en plan free).

## Pasos (5 minutos)

1. Entrá en [formspree.io](https://formspree.io) y creá cuenta (o iniciá sesión).
2. **+ New form**
3. **Email** de notificaciones: `hello@wearecacho.com`
4. Creá el formulario y copiá el **Form ID** de la URL:
   - Ejemplo: `https://formspree.io/f/mxyzabcd` → el ID es `mxyzabcd`
5. En el proyecto, abrí `contact-form-config.js` y pegá el ID:

```javascript
window.CACHO_FORMSPREE_FORM_ID = "mxyzabcd";
```

6. Subí `contact-form-config.js` al hosting junto con el resto de la web.
7. Probá en la home, sección **Contacto**: enviá un mensaje de prueba y revisá la bandeja de `hello@wearecacho.com` (y spam).

## Archivos

| Archivo | Uso |
|---------|-----|
| `contact-form-config.js` | Tu ID real (no subas vacío a producción) |
| `contact-form-config.example.js` | Plantilla de referencia |
| `script.js` | Envío AJAX y mensajes ES / CA / EN |

## Comportamiento

- Campos: nombre, email, mensaje.
- Asunto del correo: «Consulta web CACHO» (o traducción según idioma).
- Respuestas al cliente: configurá **Reply-To** en Formspree usando el campo `email` (por defecto Formspree lo detecta).
- Si el ID está vacío, el usuario ve: *Formulario pendiente de configurar*.

## Plan gratuito

Formspree Free suele bastar para un restaurante. Si superás el límite, valorá plan de pago o integración por correo propio (SMTP / Apps Script).
