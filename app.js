document.documentElement.classList.add("js");

/* ---------- hero background video ---------- */
const heroVideo = document.querySelector(".hero__video");
if (heroVideo) {
  const calm = matchMedia("(prefers-reduced-motion: reduce)");
  const syncVideo = () => {
    if (calm.matches) heroVideo.pause();
    else heroVideo.play().catch(() => {});
  };
  syncVideo();
  calm.addEventListener("change", syncVideo);
}

/* ---------- nav over hero / scrolled ---------- */
const siteNav = document.querySelector(".nav");
if (siteNav) {
  const syncNav = () => siteNav.classList.toggle("is-scrolled", scrollY > 40);
  syncNav();
  addEventListener("scroll", syncNav, { passive: true });
}

/* ---------- mobile menu ---------- */
const menuBtn = document.querySelector(".nav__menu");
const menuPanel = document.getElementById("nav-panel");

if (menuBtn && menuPanel) {
  const openLabel = menuBtn.dataset.labelOpen || "Open menu";
  const closeLabel = menuBtn.dataset.labelClose || "Close menu";
  const setMenu = (open, restoreFocus = false) => {
    menuPanel.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? closeLabel : openLabel);
    document.body.classList.toggle("is-menu-open", open);
    if (open) menuPanel.querySelector("a")?.focus();
    if (!open && restoreFocus) menuBtn.focus();
  };
  menuBtn.addEventListener("click", () => setMenu(menuPanel.hidden));
  menuPanel.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (menuPanel.hidden) return;
    if (menuPanel.contains(e.target) || menuBtn.contains(e.target)) return;
    setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menuPanel.hidden) setMenu(false, true);
  });
  matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });
}

/* ---------- scroll reveal ---------- */
const targets = [...document.querySelectorAll(".reveal")];
const pending = new Set(targets);
let queued = false;

function check() {
  queued = false;
  const limit = innerHeight * 0.92;
  for (const el of pending) {
    // A clipped element reports zero intersection to IntersectionObserver,
    // so reveal is driven by its layout box instead.
    if (el.getBoundingClientRect().top < limit) {
      el.classList.add("is-in");
      pending.delete(el);
    }
  }
  if (!pending.size) {
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onScroll);
  }
}

function onScroll() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(check);
}

addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
check();
