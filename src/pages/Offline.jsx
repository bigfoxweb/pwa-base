export default function Offline() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">
        Você está offline
      </h1>

      <p className="mt-4 text-gray-600">
        Verifique sua conexão com a internet e tente novamente.
      </p>
    </div>
  );
}