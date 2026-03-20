const formulario = document.querySelector("form");

if (formulario) {
  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const botao = formulario.querySelector("button");
    const textoOriginal = botao.textContent;

    botao.disabled = true;
    botao.textContent = "Enviando...";

    const dados = new FormData(formulario);

    try {
      const resposta = await fetch("./enviar.php", {
        method: "POST",
        body: dados,
      });

      const resultado = await resposta.json();

      if (resultado.status === "success") {
        formulario.innerHTML = `
          <div style="grid-column: 1/-1; padding: 1rem; border: 2px solid #1fc068; border-radius: 4px;">
            <p class="font-1-l" style="color: #1fc068; margin: 0;">
              <strong>Mensagem enviada!</strong> Em breve entraremos em contato.
            </p>
          </div>`;
      } else {
        throw new Error();
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);

      const erroMsg = document.createElement("p");
      erroMsg.innerHTML = `<span style="color: #e00000;">Erro no envio.</span> Tente novamente ou envie para: contato@mgiv.com.br`;
      erroMsg.style.gridColumn = "1/-1";

      formulario.appendChild(erroMsg);

      botao.disabled = false;
      botao.textContent = textoOriginal;
    }
  });
}
