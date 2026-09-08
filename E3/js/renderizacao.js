const NOMES_PRIORIDADE = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

function formatarPrazo(prazoIso) {
  const [ano, mes, dia] = prazoIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function criarCartao(tarefa) {
  const cartao = document.createElement("article");
  cartao.dataset.tarefaId = tarefa.id;

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

export function instalarEventosDoQuadro(quadro, tarefas) {
  quadro.addEventListener("click", (evento) => {
    if (!(evento.target instanceof Element)) return;

    const botao = evento.target.closest('button[data-acao="ver-detalhes"]');
    if (!botao || !quadro.contains(botao)) return;

    const cartao = botao.closest("[data-tarefa-id]");
    const tarefa = tarefas.find((item) => item.id === cartao?.dataset.tarefaId);
    if (!tarefa) return;

    console.log("Detalhes da tarefa:", tarefa);
  });
}
