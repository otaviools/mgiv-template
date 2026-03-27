function resetarBotao(botao) {
  botao.textContent = "Enviar Mensagem";
  botao.classList.remove("botao-sucesso");
  botao.disabled = false;
}

const formulario = document.querySelector(".form");

if (formulario) {
  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const botao = formulario.querySelector("button");
    const textoOriginal = botao.textContent;

    botao.textContent = "Enviando...";
    botao.disabled = true;

    const dados = new FormData(formulario);

    try {
      const resposta = await fetch("./enviar.php", {
        method: "POST",
        body: dados,
      });

      const resultado = await resposta.json();

      if (resultado.status === "success") {
        botao.textContent = "Enviado ✓";
        botao.classList.add("botao-sucesso");
        formulario.reset();

        setTimeout(() => resetarBotao(botao), 3000);
      } else {
        alert("Erro: " + (resultado.message || "Erro desconhecido"));
        resetarBotao(botao);
      }
    } catch (err) {
      alert("Erro de conexão. Verifique sua internet ou o servidor.");
      resetarBotao(botao);
    }
  });
}
