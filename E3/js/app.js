import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";

async function iniciar() {
  const quadro = document.querySelector("[data-quadro]");
  if (!quadro) {
    throw new Error("Contêiner [data-quadro] não encontrado.");
  }

  renderizarEstado("carregando", null);

  try {
    const tarefas = await carregarTarefas();

    if (tarefas.length === 0) {
      renderizarEstado("vazio", tarefas);
    } else {
      renderizarEstado("sucesso", tarefas);
    }
  } catch (erro) {
    renderizarEstado("erro", erro);
  }
}

iniciar();
