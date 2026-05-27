/**
 * CACHO — Carta → JSON público
 * Pegar en Extensiones → Apps Script de la hoja "CACHO — Cartas"
 */

function doGet(e) {
  const payload = {
    updatedAt: new Date().toISOString(),
    comidas: sheetToObjects("Comidas"),
    bebidas: sheetToObjects("Bebidas"),
    grupos: sheetToObjects("Menú Grupos"),
    secciones: sheetToObjects("Secciones"),
  };

  const json = JSON.stringify(payload);
  const callback = e && e.parameter && e.parameter.callback;

  if (callback) {
    return ContentService.createTextOutput(callback + "(" + json + ")").setMimeType(
      ContentService.MimeType.JAVASCRIPT
    );
  }

  return ContentService.createTextOutput(json).setMimeType(
    ContentService.MimeType.JSON
  );
}

function sheetToObjects(sheetName) {
  const sh = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sh) return [];

  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(String);
  const idxActive = headers.indexOf("active");

  return values
    .slice(1)
    .filter((row) => {
      if (idxActive === -1) return true;
      const v = row[idxActive];
      return v === true || String(v).toUpperCase() === "TRUE";
    })
    .map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        if (!h) return;
        obj[h] = row[i];
      });
      return obj;
    });
}
