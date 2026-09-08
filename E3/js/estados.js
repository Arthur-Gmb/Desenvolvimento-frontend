import { renderizarTarefas, instalarEventosDoQuadro } from "./renderizacao.js";

let eventosInstalados = false;

function mensagemDeErro(erro) {
  if (erro.name === "TypeError") {
    return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
  }
  if (erro.name === "SyntaxError") {
    return "Os dados recebidos estão em um formato inválido.";
  }
  return `Não foi possível carregar as tarefas (${erro.message}).`;
}

export function renderizarEstado(estado, dados) {
  const elementoStatus = document.querySelector("[data-estado]");
  const quadro = document.querySelector("[data-quadro]");

  switch (estado) {
    case "carregando":
      elementoStatus.textContent = "Carregando tarefas...";
      break;

    case "sucesso":
      renderizarTarefas(dados, quadro);
      if (!eventosInstalados) {
        instalarEventosDoQuadro(quadro, dados);
        eventosInstalados = true;
      }
      elementoStatus.textContent = `${dados.length} tarefa(s) carregada(s).`;
      break;

    case "vazio":
      elementoStatus.textContent = "Nenhuma tarefa encontrada no momento.";
      break;

    case "erro":
      elementoStatus.textContent = mensagemDeErro(dados);
      break;

    default:
      break;
  }
}
