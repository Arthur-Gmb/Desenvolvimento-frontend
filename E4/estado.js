export function criarEstadoInicial() {
  return {
    tarefas: [],
    busca: "",
    status: "todos",
    prioridade: "todas",
    ordenacao: "nenhuma",
    carregamento: true,
    erro: null,
  };
}
