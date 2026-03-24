import { useApp } from "../hooks/useApp";

export default function AvisoOffline() {
  const { estaOnline } = useApp();

  if (estaOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
      Você está offline
    </div>
  );
}