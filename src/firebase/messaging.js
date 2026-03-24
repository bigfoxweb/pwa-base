import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "./config";

const messaging = app ? getMessaging(app) : null;

export async function solicitarPermissao() {
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export async function obterToken() {
  if (!messaging) {
    console.log("Messaging não inicializado");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    console.log("Usando SW:", registration);

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (error) {
    console.error("Erro ao obter token:", error);
    return null;
  }
}

export function escutarMensagens(callback) {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Mensagem recebida (foreground):", payload);
    callback?.(payload);
  });
}