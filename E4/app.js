import { carregarTarefas } from "./api.js";
import { criarEstadoInicial } from "./estado.js";
import { renderizarResultado } from "./estados.js";
import { instalarControles } from "./eventos.js";

const estado = criarEstadoInicial();

function renderizar() {
  const quadro = document.querySelector("[data-quadro]");
  renderizarResultado(estado, quadro);
}

async function iniciar() {
  const quadro = document.querySelector("[data-quadro]");
  if (!quadro) {
    throw new Error("Contêiner [data-quadro] não encontrado.");
  }

  instalarControles(estado, renderizar);

  estado.carregamento = true;
  renderizar();

  try {
    estado.tarefas = await carregarTarefas();
  } catch (erro) {
    estado.erro = erro;
  }

  estado.carregamento = false;
  renderizar();
}

iniciar();
