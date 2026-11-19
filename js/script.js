// Menu mobile
const menu = document.querySelector("#menu");
const menuToggle = document.querySelector(".menu-toggle");

if (menu && menuToggle) {
  const setMenu = (aberto) => {
    menu.classList.toggle("aberto", aberto);
    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu",
    );
  };

  menuToggle.addEventListener("click", () =>
    setMenu(!menu.classList.contains("aberto")),
  );
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
}

// Sombra no header ao rolar
const header = document.querySelector(".header");
let ticking = false;

if (header) {
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle("scrolled", window.scrollY > 10);
        ticking = false;
      });
    },
    { passive: true },
  );
}

// Animação de entrada
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

document
  .querySelectorAll(".hidden, .revela")
  .forEach((el) => observer.observe(el));

// Contadores
function animarContadores() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const contadores = document.querySelectorAll("[data-contador]");

  const observerContador = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const match = el.textContent.trim().match(/^([+\-]?)(\d+)(%?)$/);
        observerContador.unobserve(el);
        if (!match) return;

        const [, prefixo, numero, sufixo] = match;
        const alvo = parseInt(numero, 10);
        const duracao = 1600;
        const inicio = performance.now();

        function tick(agora) {
          const progresso = Math.min((agora - inicio) / duracao, 1);
          const ease = 1 - Math.pow(1 - progresso, 3);
          el.textContent = prefixo + Math.round(ease * alvo) + sufixo;
          if (progresso < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 },
  );

  contadores.forEach((el) => observerContador.observe(el));
}

animarContadores();

// Progresso de rolagem no header + link ativo no menu
const linksMenu = [
  ...document.querySelectorAll('.menu a[href^="#"]:not(.botao)'),
];
const secoes = linksMenu
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function atualizarRolagem() {
  const meio = window.scrollY + window.innerHeight * 0.35;
  let atual = null;
  secoes.forEach((secao) => {
    if (secao.offsetTop <= meio) atual = secao.id;
  });
  linksMenu.forEach((link) =>
    link.classList.toggle("ativo", link.getAttribute("href") === "#" + atual),
  );
}

window.addEventListener(
  "scroll",
  () => requestAnimationFrame(atualizarRolagem),
  {
    passive: true,
  },
);
atualizarRolagem();

// Carrossel de avaliações
document.querySelectorAll(".carrossel").forEach((carrossel) => {
  const trilho = carrossel.querySelector(".carrossel-trilho");
  const slides = [...trilho.children];
  const pontos = carrossel.querySelector(".carrossel-pontos");
  const tempo = carrossel.querySelector(".carrossel-tempo");
  const intervalo = 5000;
  const semMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let timer = null;
  let pausado = false;

  const passo = () =>
    slides.length > 1
      ? slides[1].offsetLeft - slides[0].offsetLeft
      : trilho.clientWidth;
  const ultimaPosicao = () => trilho.scrollWidth - trilho.clientWidth;
  const totalPaginas = () =>
    Math.max(1, Math.round(ultimaPosicao() / passo()) + 1);
  const paginaAtual = () => Math.round(trilho.scrollLeft / passo());

  function irPara(pagina) {
    const total = totalPaginas();
    const alvo = ((pagina % total) + total) % total;
    trilho.scrollTo({ left: Math.min(alvo * passo(), ultimaPosicao()) });
  }

  function montarPontos() {
    // Com tudo visível de uma vez, os controles somem
    carrossel.classList.toggle("sem-rolagem", totalPaginas() < 2);
    pontos.innerHTML = "";
    for (let i = 0; i < totalPaginas(); i++) {
      const ponto = document.createElement("button");
      ponto.type = "button";
      ponto.setAttribute("aria-label", `Ir para a avaliação ${i + 1}`);
      ponto.addEventListener("click", () => {
        irPara(i);
        reiniciar();
      });
      pontos.appendChild(ponto);
    }
    marcarPonto();
  }

  function marcarPonto() {
    const atual = paginaAtual();
    [...pontos.children].forEach((ponto, i) =>
      ponto.setAttribute("aria-current", String(i === atual)),
    );
  }

  function reiniciar() {
    clearInterval(timer);
    tempo.classList.remove("rodando");
    if (semMovimento || pausado || totalPaginas() < 2) return;
    void tempo.offsetWidth; // reinicia a animação da barra
    tempo.classList.add("rodando");
    timer = setInterval(() => {
      irPara(paginaAtual() + 1);
      reiniciar();
    }, intervalo);
  }

  function pausar(estado) {
    pausado = estado;
    carrossel.classList.toggle("pausado", estado);
    if (estado) clearInterval(timer);
    else reiniciar();
  }

  carrossel.style.setProperty("--intervalo", intervalo + "ms");
  if (semMovimento) tempo.hidden = true;

  carrossel.querySelectorAll(".carrossel-seta").forEach((seta) =>
    seta.addEventListener("click", () => {
      irPara(paginaAtual() + Number(seta.dataset.dir));
      reiniciar();
    }),
  );

  let rolando;
  trilho.addEventListener(
    "scroll",
    () => {
      clearTimeout(rolando);
      rolando = setTimeout(marcarPonto, 80);
    },
    { passive: true },
  );

  carrossel.addEventListener("mouseenter", () => pausar(true));
  carrossel.addEventListener("mouseleave", () => pausar(false));
  carrossel.addEventListener("focusin", () => pausar(true));
  carrossel.addEventListener("focusout", (e) => {
    if (!carrossel.contains(e.relatedTarget)) pausar(false);
  });
  trilho.addEventListener("touchstart", () => reiniciar(), { passive: true });

  // Só começa a rodar quando o carrossel aparece na tela
  new IntersectionObserver(
    ([entrada]) => {
      if (entrada.isIntersecting) reiniciar();
      else clearInterval(timer);
    },
    { threshold: 0.4 },
  ).observe(carrossel);

  let redimensionando;
  window.addEventListener("resize", () => {
    clearTimeout(redimensionando);
    redimensionando = setTimeout(() => {
      montarPontos();
      reiniciar();
    }, 150);
  });

  montarPontos();
});

// Localização: aberto agora / fechado (horário de Brasília)
const statusHorario = document.querySelector("[data-status-horario]");

function atualizarStatusHorario() {
  if (!statusHorario) return;
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  const minutos = Number(partes.hour) * 60 + Number(partes.minute);
  const diaUtil = !["Sat", "Sun"].includes(partes.weekday);
  const aberto = diaUtil && minutos >= 8 * 60 && minutos < 17 * 60 + 45;

  statusHorario.classList.toggle("aberto", aberto);
  statusHorario.querySelector("span").innerHTML = aberto
    ? "<b>Aberto agora</b> | Fecha às 17:45"
    : "<b>Fechado</b> | Seg a Sex, 08:00 às 17:45";
}

atualizarStatusHorario();
setInterval(atualizarStatusHorario, 60000);

// Âncoras: centraliza o CONTEÚDO da seção na área abaixo do header.
// Usa a caixa sem o padding vertical: no celular quase toda seção é mais alta
// que a tela, e alinhar pela seção inteira deixava uma faixa vazia (o padding)
// no lugar do título. Se o conteúdo não couber, o título fica logo abaixo do header.
function rolarParaSecao(alvo, suave = true) {
  const header = document.querySelector(".header");
  const alturaHeader = header ? header.offsetHeight : 0;
  const folga = window.innerWidth <= 900 ? 20 : 32;
  const areaVisivel = window.innerHeight - alturaHeader - folga * 2;

  const estilo = getComputedStyle(alvo);
  const caixa = alvo.getBoundingClientRect();
  const topoConteudo =
    window.scrollY + caixa.top + parseFloat(estilo.paddingTop);
  const alturaConteudo =
    caixa.height -
    parseFloat(estilo.paddingTop) -
    parseFloat(estilo.paddingBottom);

  const destino =
    alturaConteudo < areaVisivel
      ? topoConteudo - alturaHeader - folga - (areaVisivel - alturaConteudo) / 2
      : topoConteudo - alturaHeader - folga;

  const semMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({
    top: Math.max(0, destino),
    behavior: suave && !semMovimento ? "smooth" : "auto",
  });
}

document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute("href");
  if (id === "#" || id === "#home") return;
  const alvo = document.querySelector(id);
  if (!alvo) return;

  e.preventDefault();
  rolarParaSecao(alvo);
  history.pushState(null, "", id);
});

// Também ao abrir a página já com #secao no endereço
window.addEventListener("load", () => {
  const alvo = location.hash && document.querySelector(location.hash);
  if (alvo) rolarParaSecao(alvo, false);
});
