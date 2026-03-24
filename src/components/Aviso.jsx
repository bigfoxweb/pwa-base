export default function Aviso({ tipo = "info", texto = "" }) {
  if (!texto) return null;

  const estilos = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    sucesso: "border-green-200 bg-green-50 text-green-800",
    erro: "border-red-200 bg-red-50 text-red-800",
    alerta: "border-yellow-200 bg-yellow-50 text-yellow-800",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${estilos[tipo] || estilos.info}`}>
      {texto}
    </div>
  );
}