import { Link } from "react-router-dom";

export default function NaoEncontrado() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold">
        Página não encontrada
      </h1>

      <Link
        to="/"
        className="rounded-lg bg-[#7d2211] px-4 py-2 text-white"
      >
        Voltar para o início
      </Link>
    </div>
  );
}