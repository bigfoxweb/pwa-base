const URL_BASE = "/api";

function extrairMensagemErro(dados, resposta) {
  if (typeof dados === "object" && dados !== null) {
    if (dados.erro) return dados.erro;
    if (dados.mensagem) return dados.mensagem;
  }

  if (typeof dados === "string" && dados.trim()) {
    return dados;
  }

  return `Erro ${resposta.status} na comunicação com a API`;
}

export async function buscarApi(caminho, opcoes = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s

  let resposta;

  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(opcoes.headers || {}),
      },
      signal: controller.signal,
      ...opcoes,
    });
  } catch (erro) {
    clearTimeout(timeout);

    if (erro.name === "AbortError") {
      throw new Error("Tempo de requisição esgotado");
    }

    throw new Error("Não foi possível conectar com a API");
  }

  clearTimeout(timeout);

  const tipoConteudo = resposta.headers.get("content-type") || "";
  const ehJson = tipoConteudo.includes("application/json");

  const dados = ehJson ? await resposta.json() : await resposta.text();

  if (!resposta.ok) {
    throw new Error(extrairMensagemErro(dados, resposta));
  }

  return dados;
}