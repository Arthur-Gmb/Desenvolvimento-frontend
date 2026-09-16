const NOMES_PRIORIDADE = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

const NOMES_STATUS = {
  "a-fazer": "A fazer",
  "em-andamento": "Em andamento",
  "em-revisao": "Em revisão",
  concluida: "Concluída",
};

function formatarPrazo(prazoIso) {
  const [ano, mes, dia] = prazoIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function criarCartao(tarefa) {
  const cartao = document.createElement("article");
  cartao.dataset.tarefaId = tarefa.id;
  cartao.draggable = true;

  const titulo = document.createElement("h4");
  titulo.textContent = tarefa.titulo;
  cartao.append(titulo);

  const prazo = document.createElement("p");
  prazo.textContent = `Prazo: ${formatarPrazo(tarefa.prazo)}`;
  cartao.append(prazo);

  const prioridade = document.createElement("p");
  prioridade.className = `prioridade ${tarefa.prioridade}`;
  prioridade.textContent = `Prioridade: ${NOMES_PRIORIDADE[tarefa.prioridade] ?? tarefa.prioridade}`;
  cartao.append(prioridade);

  const botao = document.createElement("button");
  botao.type = "button";
  botao.dataset.acao = "ver-detalhes";
  const rotulo = document.createElement("span");
  rotulo.textContent = "Ver detalhes";
  botao.append(rotulo);
  cartao.append(botao);

  return cartao;
}

export function renderizarTarefas(tarefas, quadro) {
  const colunas = quadro.querySelectorAll("[data-lista-status]");

  colunas.forEach((lista) => {
    const status = lista.dataset.listaStatus;
    const tarefasDaColuna = tarefas.filter((tarefa) => tarefa.status === status);

    if (tarefasDaColuna.length === 0) {
      const vazio = document.createElement("li");
      vazio.className = "coluna-vazia";
      vazio.textContent = "Nenhuma tarefa nesta coluna.";
      lista.replaceChildren(vazio);
      return;
    }

    const itens = tarefasDaColuna.map((tarefa) => {
      const item = document.createElement("li");
      item.append(criarCartao(tarefa));
      return item;
    });

    lista.replaceChildren(...itens);
  });
}

export function instalarEventosDoQuadro(quadro, estado, renderizar) {
  quadro.addEventListener("click", (evento) => {
    if (!(evento.target instanceof Element)) return;

    const botao = evento.target.closest('button[data-acao="ver-detalhes"]');
    if (!botao || !quadro.contains(botao)) return;

    const cartao = botao.closest("[data-tarefa-id]");
    const tarefa = estado.tarefas.find((item) => item.id === cartao?.dataset.tarefaId);
    if (!tarefa) return;

    abrirModalDetalhes(tarefa);
  });

  instalarArrastarESoltar(quadro, estado, renderizar);
}

/* ==========================================================================
   Modal de detalhes da tarefa (elemento <dialog> nativo do HTML5)
   ========================================================================== */
function abrirModalDetalhes(tarefa) {
  const modal = document.querySelector("[data-modal-detalhes]");
  if (!modal) return;

  modal.querySelector("[data-modal-titulo]").textContent = tarefa.titulo;
  modal.querySelector("[data-modal-status]").textContent =
    `Status: ${NOMES_STATUS[tarefa.status] ?? tarefa.status}`;
  modal.querySelector("[data-modal-prazo]").textContent = `Prazo: ${formatarPrazo(tarefa.prazo)}`;
  modal.querySelector("[data-modal-prioridade]").textContent =
    `Prioridade: ${NOMES_PRIORIDADE[tarefa.prioridade] ?? tarefa.prioridade}`;
  modal.querySelector("[data-modal-descricao]").textContent =
    tarefa.descricao ?? "Sem descrição cadastrada para esta tarefa.";

  modal.showModal();
}

/* ==========================================================================
   Drag and Drop nativo (HTML5 Drag and Drop API — sem bibliotecas externas)
   Permite mover um cartão entre colunas, atualizando o status da tarefa.
   ========================================================================== */
function instalarArrastarESoltar(quadro, estado, renderizar) {
  quadro.addEventListener("dragstart", (evento) => {
    const cartao = evento.target.closest?.("[data-tarefa-id]");
    if (!cartao) return;

    evento.dataTransfer.setData("text/plain", cartao.dataset.tarefaId);
    evento.dataTransfer.effectAllowed = "move";
    cartao.classList.add("arrastando");
  });

  quadro.addEventListener("dragend", (evento) => {
    const cartao = evento.target.closest?.("[data-tarefa-id]");
    cartao?.classList.remove("arrastando");

    quadro.querySelectorAll("[data-lista-status]").forEach((lista) => {
      lista.classList.remove("zona-soltura-ativa");
    });
  });

  quadro.querySelectorAll("[data-lista-status]").forEach((lista) => {
    lista.addEventListener("dragover", (evento) => {
      evento.preventDefault();
      evento.dataTransfer.dropEffect = "move";
      lista.classList.add("zona-soltura-ativa");
    });

    lista.addEventListener("dragleave", () => {
      lista.classList.remove("zona-soltura-ativa");
    });

    lista.addEventListener("drop", (evento) => {
      evento.preventDefault();
      lista.classList.remove("zona-soltura-ativa");

      const tarefaId = evento.dataTransfer.getData("text/plain");
      const tarefa = estado.tarefas.find((item) => item.id === tarefaId);
      if (!tarefa) return;

      const novoStatus = lista.dataset.listaStatus;
      if (tarefa.status === novoStatus) return;

      tarefa.status = novoStatus;
      renderizar();
    });
  });
}
