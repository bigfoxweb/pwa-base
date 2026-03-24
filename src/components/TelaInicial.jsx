export default function TelaInicial() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 animate-pulse rounded-2xl bg-[#7d2211]" />

        <div>
          <h1 className="text-xl font-bold text-gray-900">PWA Base</h1>
          <p className="text-sm text-gray-500">Carregando aplicativo...</p>
        </div>
      </div>
    </div>
  );
}