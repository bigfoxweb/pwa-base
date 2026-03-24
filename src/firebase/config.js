console.log("firebase/config carregou");
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

function temConfigValida(config) {
  return Object.values(config).some((valor) => valor && valor !== "");
}

let app = null;

if (temConfigValida(firebaseConfig)) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

  if (import.meta.env.DEV) {
    console.log("Firebase inicializado:", app.name);
  }

} else {
  console.warn("Firebase não configurado");
}

export default app;

