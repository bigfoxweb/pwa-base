import { useApp } from "../hooks/useApp";

export default function BotaoInstalarPwa() {
  const { podeInstalar, instalarApp } = useApp();

  if (!podeInstalar) return null;

  async function aoClicar() {
    await instalarApp();
  }

  return (
    <button
      type="button"
      onClick={aoClicar}
      className="rounded-lg bg-[#7d2211] px-4 py-2 font-medium text-white"
    >
      Instalar aplicativo
    </button>
  );
}