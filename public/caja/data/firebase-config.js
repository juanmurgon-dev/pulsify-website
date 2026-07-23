/* ══════════════════════════════════════════════════════════════════════════
   CONEXIÓN A LA NUBE (Firebase) — para la Pantalla de Pedidos y los pagos
   ──────────────────────────────────────────────────────────────────────────
   Mientras esto NO esté configurado, el sitio sigue funcionando por WhatsApp
   y la Pantalla de Pedidos (pedidos.html) corre en "MODO DEMO" para que la
   puedas probar. Cuando tengas tu proyecto de Firebase (ver
   GUIA-PANTALLA-PEDIDOS.md), pega aquí tu configuración y listo.

   Pasos rápidos:
   1. Crea un proyecto gratis en https://console.firebase.google.com
   2. Agrega una "app web" y copia el objeto de configuración.
   3. Pégalo abajo reemplazando los "PEGA_AQUI_...".
   ══════════════════════════════════════════════════════════════════════════ */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCBV1uhuoOwHvSSjMQLo4eBtiduUvErvX8",
  authDomain: "cremina-pedidos.firebaseapp.com",
  projectId: "cremina-pedidos",
  storageBucket: "cremina-pedidos.firebasestorage.app",
  messagingSenderId: "890540085126",
  appId: "1:890540085126:web:b24d463f4a21375d752607"
};

/* Se considera "configurado" cuando ya cambiaste el apiKey de ejemplo. */
window.FIREBASE_READY = !String(window.FIREBASE_CONFIG.apiKey).startsWith("PEGA_AQUI");
