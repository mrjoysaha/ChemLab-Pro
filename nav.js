(function () {
  "use strict";

  const hamburger = document.getElementById("hamburgerBtn");
  const drawer = document.getElementById("siteDrawer");
  const overlay = document.getElementById("drawerOverlay");
  const closeBtn = document.getElementById("drawerCloseBtn");

  if (!hamburger || !drawer || !overlay) return;

  function openDrawer(){
    drawer.classList.add("open");
    hamburger.classList.add("open");
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("show"));
    hamburger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer(){
    drawer.classList.remove("open");
    hamburger.classList.remove("open");
    overlay.classList.remove("show");
    hamburger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => { overlay.hidden = true; }, 300);
  }
  function toggleDrawer(){
    drawer.classList.contains("open") ? closeDrawer() : openDrawer();
  }

  hamburger.addEventListener("click", toggleDrawer);
  overlay.addEventListener("click", closeDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

  // accordion sections inside the drawer
  document.querySelectorAll(".drawer-section-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".drawer-section");
      const isOpen = section.classList.contains("open");
      section.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // highlight the current page in the drawer, and auto-expand its section
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".drawer-link, .drawer-submenu a").forEach(a => {
    const target = a.getAttribute("href");
    if (target === here){
      a.classList.add("active");
      const section = a.closest(".drawer-section");
      if (section){
        section.classList.add("open");
        const toggle = section.querySelector(".drawer-section-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "true");
      }
    }
  });
})();
