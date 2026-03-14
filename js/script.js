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
  { threshold: 0.1 },
);

document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));
