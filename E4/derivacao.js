function ordenarPorPrazo(lista, ordenacao) {
  const copia = [...lista];

  copia.sort((a, b) => {
    const diferenca = a.prazo.localeCompare(b.prazo);
    return ordenacao === "prazo-desc" ? -diferenca : diferenca;
  });

  return copia;
}

export function derivarTarefasVisiveis(estado) {
  const termo = estado.busca.trim().toLowerCase();

  let resultado = estado.tarefas.filter((tarefa) => {
    const combinaBusca = termo === "" || tarefa.titulo.toLowerCase().includes(termo);
    const combinaStatus = estado.status === "todos" || tarefa.status === estado.status;
    const combinaPrioridade =
      estado.prioridade === "todas" || tarefa.prioridade === estado.prioridade;

    return combinaBusca && combinaStatus && combinaPrioridade;
  });

  if (estado.ordenacao === "prazo-asc" || estado.ordenacao === "prazo-desc") {
    resultado = ordenarPorPrazo(resultado, estado.ordenacao);
  }

  return resultado;
}
