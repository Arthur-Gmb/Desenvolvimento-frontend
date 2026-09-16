import { renderizarTarefas, instalarEventosDoQuadro } from "./renderizacao.js";
import { derivarTarefasVisiveis } from "./derivacao.js";
import { atualizarMetricas } from "./metricas.js";

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

export function renderizarResultado(estado, quadro, renderizar) {
  const elementoStatus = document.querySelector("[data-estado]");

  if (estado.carregamento) {
    elementoStatus.textContent = "Carregando tarefas...";
    return;
  }

  if (estado.erro) {
    elementoStatus.textContent = mensagemDeErro(estado.erro);
    return;
  }

  if (estado.tarefas.length === 0) {
    renderizarTarefas([], quadro);
    elementoStatus.textContent = "Nenhuma tarefa encontrada no momento.";
    atualizarMetricas(estado.tarefas);
    return;
  }

  atualizarMetricas(estado.tarefas);

  const visiveis = derivarTarefasVisiveis(estado);
  renderizarTarefas(visiveis, quadro);

  if (!eventosInstalados) {
    instalarEventosDoQuadro(quadro, estado, renderizar);
    eventosInstalados = true;
  }

  if (visiveis.length === 0) {
    elementoStatus.textContent = `Nenhum resultado para os critérios atuais (0 de ${estado.tarefas.length} tarefas). Ajuste ou limpe os filtros.`;
  } else {
    elementoStatus.textContent = `${visiveis.length} de ${estado.tarefas.length} tarefas.`;
  }
}
