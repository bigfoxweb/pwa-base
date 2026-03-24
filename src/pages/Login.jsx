import { useState } from "react";

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [formulario, setFormulario] = useState({
    login: "",
    senha: "",
  });
  const [erro, setErro] = useState("");

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setErro("");

    if (!formulario.login.trim() || !formulario.senha.trim()) {
      setErro("Preencha seu login e sua senha.");
      return;
    }

    try {
      setCarregando(true);

      await new Promise((resolve) => {
        setTimeout(resolve, 800);
      });
    } catch {
      setErro("Não foi possível entrar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[var(--cor-fundo)] px-6 py-10">
      <section className="w-full max-w-[sm]">
        <div className="mb-10 flex flex-col items-center text-center">
          <img
            src="/img/logo.avif"
            alt="Logo do aplicativo"
            className="mb-6 max-w-[200px] h-20 w-auto object-contain"
          />

          <h1 className="text-2xl font-bold leading-tight text-gray-500 fonte-titulo">
            Entrar no aplicativo
          </h1>

          <p className="text-sm leading-7 text-slate-400 font-texto">
            Acesse sua conta para continuar.
          </p>
        </div>

        <form onSubmit={enviarFormulario} className="space-y-5">
          <div>
            <label
              htmlFor="login"
              className="mb-2 block text-sm font-semibold text-slate-500"
            >
              Login ou e-mail
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.239-8 5v1h16v-1c0-2.761-3.58-5-8-5Z" />
                </svg>
              </span>

              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                value={formulario.login}
                onChange={atualizarCampo}
                placeholder="Digite seu login"
                className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-[var(--cor-primaria)]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-2 block text-sm font-semibold text-slate-500"
            >
              Senha
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4Z" />
                </svg>
              </span>

              <input
                id="senha"
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                value={formulario.senha}
                onChange={atualizarCampo}
                placeholder="Digite sua senha"
                className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-24 text-base text-slate-900 outline-none transition focus:border-[var(--cor-primaria)]"
              />

              <button
                type="button"
                onClick={() => setMostrarSenha((valor) => !valor)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--cor-primaria)]"
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-[var(--cor-primaria)]"
            >
              Esqueci minha senha
            </button>
          </div>

          {erro ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {erro}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={carregando}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--cor-primaria)] px-5 text-base font-normal font-titulo text-white transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}