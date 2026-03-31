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
    const dados = new FormData(formulario);

    const nome = dados.get("nome")?.trim();
    const email = dados.get("email")?.trim().toLowerCase();
    const mensagem = dados.get("mensagem")?.trim();

    let telefone = dados.get("telefone")?.replace(/\D/g, ""); // Remove tudo que não é número

    if (telefone.length > 11 && telefone.startsWith("55")) {
      telefone = telefone.substring(2);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nomeRegex = /^[a-zA-ZÀ-ÿ'-]{2,}(?:\s[a-zA-ZÀ-ÿ'-]{1,})+$/;
    const dominiosBloqueados = [
      "email.com",
      "teste.com",
      "test.com",
      "exemplo.com",
      "example.com",
      "abc.com",
    ];
    const dominioInformado = email ? email.split("@")[1] : "";

    if (!nomeRegex.test(nome)) {
      alert("Por favor, digite seu nome completo (Nome e Sobrenome).");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Por favor, digite um e-mail válido.");
      return;
    }

    if (dominiosBloqueados.includes(dominioInformado)) {
      alert(
        "Por favor, use um e-mail real. Domínios de teste não são aceitos.",
      );
      return;
    }

    if (telefone.length < 10 || telefone.length > 11) {
      alert(
        "Telefone inválido. Use apenas DDD + Número (ex: 34999999999) sem o +55.",
      );
      return;
    }

    if (!mensagem) {
      alert("A mensagem não pode estar vazia.");
      return;
    }

    dados.set("telefone", telefone);

    botao.textContent = "Enviando...";
    botao.disabled = true;

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
