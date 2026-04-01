// Sidebar Mobile
const sidebar = document.querySelector(".sideBar");
const menuOpen = document.querySelector(".icon-menu-open");
const menuClose = document.querySelector(".icon-menu-close");

if (sidebar && menuOpen && menuClose) {
  const closeSidebar = () => sidebar.classList.remove("active");

  menuOpen.addEventListener("click", () => sidebar.classList.add("active"));
  menuClose.addEventListener("click", closeSidebar);
  document
    .querySelectorAll(".sideBar a")
    .forEach((link) => link.addEventListener("click", closeSidebar));
}

// Scroll Header
const header = document.querySelector(".header");
let ticking = false;

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle("scrolled", window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true },
);

// Animação Suave
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));

//Scrip Animação Contadores
function animarContadores() {
  const isMobile = !window.matchMedia("(min-width: 350px)").matches;
  const prefereReducao = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (isMobile || prefereReducao) return;

  const stats = document.querySelectorAll(".stat h3");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const texto = el.textContent.trim();

        const match = texto.match(/^([+\-]?)(\d+)(%?)$/);
        if (!match) return;

        const prefixo = match[1];
        const alvo = parseInt(match[2]);
        const sufixo = match[3];

        const duracao = 2000;
        const inicio = performance.now();

        el.style.width = el.offsetWidth + "px";

        function tick(agora) {
          const progresso = Math.min((agora - inicio) / duracao, 1);
          const ease = 1 - Math.pow(1 - progresso, 3);
          const atual = Math.round(ease * alvo);

          el.textContent = prefixo + atual + sufixo;

          if (progresso < 1) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.3 },
  );

  stats.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", animarContadores);
