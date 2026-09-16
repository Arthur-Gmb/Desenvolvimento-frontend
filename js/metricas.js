/* ==========================================================================
   Painel de Métricas — calcula e exibe a visão geral do quadro.
   Reflete sempre o total de tarefas (não é afetado pelos filtros de busca),
   e é chamado a cada re-renderização, inclusive após o drag-and-drop.
   ========================================================================== */

const CORES_SEGMENTO = {
  "a-fazer": "var(--status-todo)",
  "em-andamento": "var(--status-in-progress)",
  "em-revisao": "var(--status-review)",
  concluida: "var(--status-done)",
};

export function atualizarMetricas(tarefas) {
  const anel = document.querySelector("[data-anel-progresso]");
  if (!anel) return;

  const total = tarefas.length;
  const contagemStatus = { "a-fazer": 0, "em-andamento": 0, "em-revisao": 0, concluida: 0 };

  tarefas.forEach((tarefa) => {
    if (contagemStatus[tarefa.status] !== undefined) {
      contagemStatus[tarefa.status] += 1;
    }
  });

  const percentualConcluido = total === 0 ? 0 : Math.round((contagemStatus.concluida / total) * 100);

  anel.style.setProperty("--pct", percentualConcluido);
  document.querySelector("[data-anel-percentual]").textContent = `${percentualConcluido}%`;
  document.querySelector("[data-metrica-total]").textContent = total;
  document.querySelector("[data-metrica-a-fazer]").textContent = contagemStatus["a-fazer"];
  document.querySelector("[data-metrica-em-andamento]").textContent = contagemStatus["em-andamento"];
  document.querySelector("[data-metrica-em-revisao]").textContent = contagemStatus["em-revisao"];
  document.querySelector("[data-metrica-concluida]").textContent = contagemStatus.concluida;

  const barra = document.querySelector("[data-barra-status]");
  if (!barra) return;

  if (total === 0) {
    barra.replaceChildren();
    return;
  }

  const segmentos = Object.entries(contagemStatus)
    .filter(([, quantidade]) => quantidade > 0)
    .map(([status, quantidade]) => {
      const segmento = document.createElement("div");
      segmento.className = "segmento-status";
      segmento.style.backgroundColor = CORES_SEGMENTO[status];
      segmento.style.flex = `${quantidade} 0 0%`;
      return segmento;
    });

  barra.replaceChildren(...segmentos);
}
