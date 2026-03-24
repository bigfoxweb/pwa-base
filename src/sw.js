/* eslint-disable no-undef */
/// <reference lib="webworker" />

import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const MODO_DEV = false;

// navegação preload ajuda navegação NetworkFirst
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    if ("navigationPreload" in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());
});

// -----------------------------
// OFFLINE PAGE
// -----------------------------
const BASE_URL = self.location.pathname.includes("/app/") ? "/app/" : "/";
const paginaOffline = `${BASE_URL}offline`;
const handlerAppShell = createHandlerBoundToURL(`${BASE_URL}index.html`);

registerRoute(
  ({ request }) => request.mode === "navigate",
  async ({ event }) => {
    try {
      const preloadResponse = await event.preloadResponse;
      if (preloadResponse) return preloadResponse;

      return await new NetworkFirst({
        cacheName: "paginas-cache",
        networkTimeoutSeconds: 4,
        plugins: [
          new CacheableResponsePlugin({
            statuses: [200],
          }),
          new ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dias
          }),
        ],
      }).handle({ event });
    } catch {
      const cache = await caches.open("fallback-cache");
      const offlineResponse = await cache.match(paginaOffline);
      return offlineResponse || handlerAppShell({ event });
    }
  }
);

// pré-cache manual da rota offline
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("fallback-cache").then((cache) => cache.addAll([paginaOffline]))
  );
});

// -----------------------------
// ASSETS ESTÁTICOS
// -----------------------------
registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker",
  new StaleWhileRevalidate({
    cacheName: "assets-estaticos",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
      }),
    ],
  })
);

registerRoute(
  ({ request }) =>
    request.destination === "image" ||
    request.destination === "font",
  new StaleWhileRevalidate({
    cacheName: "midia-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
      }),
    ],
  })
);

// -----------------------------
// API PHP LOCAL
// pasta /api na raiz, como você prefere
// -----------------------------
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 60 * 10, // 10 minutos
      }),
    ],
  }),
  "GET"
);

// -----------------------------
// FIREBASE / RECURSOS EXTERNOS
// -----------------------------
registerRoute(
  ({ url }) =>
    url.origin.includes("firebasestorage.googleapis.com") ||
    url.origin.includes("firebase.googleapis.com") ||
    url.origin.includes("www.gstatic.com"),
  new StaleWhileRevalidate({
    cacheName: "firebase-externo",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  })
);

// -----------------------------
// ÍCONES / MANIFEST / FAVICON
// -----------------------------
registerRoute(
  ({ url }) =>
    url.pathname.includes("/icons/") ||
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith("favicon.ico"),
  new CacheFirst({
    cacheName: "pwa-ui-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 40,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

// -----------------------------
// FALLBACK GERAL
// -----------------------------
setCatchHandler(async ({ request }) => {
  if (request.destination === "document") {
    const cache = await caches.open("fallback-cache");
    return (await cache.match(paginaOffline)) || Response.error();
  }

  return Response.error();
});

// -----------------------------
// MENSAGENS DE DEBUG / LIMPEZA
// -----------------------------
self.addEventListener("message", async (event) => {
  const tipo = event.data?.tipo;

  if (tipo === "LIMPAR_CACHE") {
    const nomes = await caches.keys();
    await Promise.all(nomes.map((nome) => caches.delete(nome)));

    const clientes = await self.clients.matchAll({ type: "window" });
    clientes.forEach((cliente) =>
      cliente.postMessage({
        tipo: "CACHE_LIMPO",
      })
    );
  }

  if (tipo === "PING_SW") {
    event.source?.postMessage({
      tipo: "PONG_SW",
      online: self.navigator?.onLine ?? true,
      timestamp: Date.now(),
    });
  }
});

if (MODO_DEV) {
  console.log("[SW] ativo");
}

// -----------------------------
// 🔥 FIREBASE MESSAGING (PUSH)
// -----------------------------
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: __FIREBASE_API_KEY__,
  authDomain: __FIREBASE_AUTH_DOMAIN__,
  projectId: __FIREBASE_PROJECT_ID__,
  storageBucket: __FIREBASE_STORAGE_BUCKET__,
  messagingSenderId: __FIREBASE_MESSAGING_SENDER_ID__,
  appId: __FIREBASE_APP_ID__,
});

const messaging = firebase.messaging();

// -----------------------------
// RECEBER PUSH (BACKGROUND)
// -----------------------------
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Push recebido:", payload);

  const titulo = payload.notification?.title || "Nova notificação";
  const opcoes = {
    body: payload.notification?.body || "",
    icon: "/icons/icon-192.png",
    data: payload.data || {},
  };

  self.registration.showNotification(titulo, opcoes);
});

// -----------------------------
// CLICK NA NOTIFICAÇÃO
// -----------------------------
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});