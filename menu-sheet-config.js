/** Pega aquí la URL de implementación que termina en /exec */
window.CACHO_MENU_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxpwtSEBkGCKWFMenATZzWyE42G4P7XfXXdnJ5dy73bm4J-TuXW8C5OGPfnIGHH-2QD/exec";

(function markMenuSheetPending() {
  if (!(window.CACHO_MENU_SHEET_URL || "").trim()) return;
  if (document.body?.dataset?.menuPage) {
    document.documentElement.classList.add("menu-sheet-pending");
  }
})();
