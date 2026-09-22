document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menu && nav) { menu.addEventListener("click", () => { const open = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", String(open)); }); nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); })); }
  const tabs = document.querySelectorAll(".faq-tab");
  const panels = document.querySelectorAll(".faq-panel");
  tabs.forEach(tab => tab.addEventListener("click", () => { tabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected","false"); }); panels.forEach(p => p.classList.remove("active")); tab.classList.add("active"); tab.setAttribute("aria-selected","true"); const panel=document.querySelector(`.faq-panel[data-panel="${tab.dataset.tab}"]`); if(panel) panel.classList.add("active"); }));
});
