(function () {
  "use strict";

  const hamburger = document.getElementById("hamburgerBtn");
  const drawer = document.getElementById("siteDrawer");
  const overlay = document.getElementById("drawerOverlay");
  const closeBtn = document.getElementById("drawerCloseBtn");

  // Dynamic Injection of Desktop Navigation inside Capsule Header
  const navInner = document.querySelector(".top-nav-inner");
  if (navInner) {
    const desktopLinks = document.createElement("div");
    desktopLinks.className = "desktop-nav-links";
    desktopLinks.innerHTML = `
      <a href="index.html" class="nav-item-link">Home</a>
      <div class="nav-item-dropdown">
        <button class="nav-dropdown-toggle">Atomic Structure <span class="chev">▾</span></button>
        <div class="nav-dropdown-menu">
          <a href="electronic-configuration.html">Electronic Configuration</a>
          <a href="subshell-orbital-concept.html">Subshell &amp; Orbital Concept</a>
          <a href="atomic-number.html">Atomic Number</a>
          <a href="isotope.html">Isotope</a>
          <a href="isotone.html">Isotone</a>
          <a href="isobar.html">Isobar</a>
          <a href="isomer.html">Isomer</a>
        </div>
      </div>
      <div class="nav-item-dropdown">
        <button class="nav-dropdown-toggle">Periodic Table <span class="chev">▾</span></button>
        <div class="nav-dropdown-menu">
          <a href="doberiner-triad-law.html">D&ouml;bereiner's Triad Law</a>
          <a href="newland-octave-rule.html">Newland's Octave Rule</a>
          <a href="mendeleev-periodic-table.html">Mendeleev's Periodic Table</a>
          <a href="modern-periodic-table.html">Modern Periodic Table</a>
        </div>
      </div>
      <a href="contact.html" class="nav-item-link">Contact</a>
    `;

    // Insert before the hamburger button
    if (hamburger) {
      navInner.insertBefore(desktopLinks, hamburger);
    } else {
      navInner.appendChild(desktopLinks);
    }
  }

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

  // highlight current page in both drawer and desktop header
  const here = location.pathname.split("/").pop() || "index.html";

  // Highlight drawer links
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

  // Highlight desktop links
  document.querySelectorAll(".nav-item-link, .nav-dropdown-menu a").forEach(a => {
    const target = a.getAttribute("href");
    if (target === here){
      a.classList.add("active");
      const dropdown = a.closest(".nav-item-dropdown");
      if (dropdown){
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        if (toggle) toggle.classList.add("active");
      }
    }
  });
})();

