import { useState } from "react";
import BotaoInstalarPwa from "../components/BotaoInstalarPwa";
import Aviso from "../components/Aviso";
import { buscarApi } from "../services/api";

export default function Inicio() {
  const [mensagem, setMensagem] = useState("");

  async function testarApi() {
    try {
      const dados = await buscarApi("/exemplo");
      setMensagem(dados.mensagem);
    } catch (erro) {
      setMensagem(erro.message);
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">

      <h1 className="text-3xl font-bold">
        Template Jundweb para criação de aplicativos
      </h1>

      <p className="max-w-md text-sm text-gray-600">
        Template base para criação de aplicativos PWA com React, Vite, Tailwind, Firebase e API em PHP.
      </p>

      <BotaoInstalarPwa />

      <button
        onClick={testarApi}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Testar API
      </button>

      <Aviso tipo="info" texto={mensagem} />

    </div>
  );
}