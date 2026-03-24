import { useEffect } from "react";
import {
  solicitarPermissao,
  obterToken,
  escutarMensagens,
} from "../firebase/messaging";

export default function useFirebaseMessaging(usuario) {
  console.log("hook useFirebaseMessaging chamou");

  useEffect(() => {
    console.log("useEffect do FCM rodou");

    async function init() {
      console.log("Iniciando FCM...");

      const permitido = await solicitarPermissao();
      console.log("Permissão:", permitido, Notification.permission);

      if (!permitido) return;

      const token = await obterToken();
      console.log("Token obtido:", token);

      if (!token) return;

      await fetch("/api/push/registrar_token.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          usuario_id: usuario?.id || null,
          plataforma: "web",
        }),
      });

      console.log("Token enviado ao backend");
    }

    escutarMensagens((payload) => {
      console.log("Push foreground:", payload);
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          console.log("Todos SW:", registrations);

          if (registrations.length > 0) {
            console.log("SW pronto");
            init();
          } else {
            console.log("SW ainda não registrado");
          }
        });
      });
    } else {
      console.log("Sem suporte a serviceWorker");
    }

  }, [usuario]);
}