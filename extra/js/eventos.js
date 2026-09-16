export function instalarControles(estado, renderizar) {
  const formulario = document.querySelector("form");
  formulario.addEventListener("submit", (evento) => evento.preventDefault());

  const campoBusca = document.querySelector("#busca-titulo");
  campoBusca.addEventListener("input", (evento) => {
    estado.busca = evento.target.value;
    renderizar();
  });

  document.querySelectorAll('input[name="filtro-status"]').forEach((input) => {
    input.addEventListener("change", (evento) => {
      estado.status = evento.target.value;
      renderizar();
    });
  });

  document.querySelectorAll('input[name="filtro-prioridade"]').forEach((input) => {
    input.addEventListener("change", (evento) => {
      estado.prioridade = evento.target.value;
      renderizar();
    });
  });

  const campoOrdenacao = document.querySelector("#ordenar-prazo");
  campoOrdenacao.addEventListener("change", (evento) => {
    estado.ordenacao = evento.target.value;
    renderizar();
  });

  const botaoLimpar = document.querySelector("#limpar-filtros");
  botaoLimpar.addEventListener("click", () => {
    estado.busca = "";
    estado.status = "todos";
    estado.prioridade = "todas";
    estado.ordenacao = "nenhuma";

    campoBusca.value = "";
    document.querySelector("#status-todos").checked = true;
    document.querySelector("#prioridade-todas").checked = true;
    campoOrdenacao.value = "nenhuma";

    renderizar();
  });
}
