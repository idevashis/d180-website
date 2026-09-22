document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open menu");
    }));
  }

  // FAQ tabs
  const tabs = document.querySelectorAll(".faq-tab");
  const panels = document.querySelectorAll(".faq-panel");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    const panel = document.querySelector(`.faq-panel[data-panel="${tab.dataset.tab}"]`);
    if (panel) panel.classList.add("active");
  }));

  // Scroll progress
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Subtle page entrance
  const transition = document.createElement("div");
  transition.className = "page-transition";
  document.body.appendChild(transition);

  // Reveal sections as they enter the viewport
  const revealItems = document.querySelectorAll("[data-reveal], .section, .content-section, .final-cta, .site-footer");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Animated counters
  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = el => {
    const target = Number(el.dataset.count);
    const duration = 850;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(counter => counterObserver.observe(counter));
  }

  // Cursor spotlight and pointer-responsive cards
  const finePointer = window.matchMedia("(pointer:fine)").matches;
  if (finePointer) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    window.addEventListener("pointermove", e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      document.querySelectorAll(".stat-card").forEach(card => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    }, { passive: true });
  }

  // Gentle tilt for interactive stat cards
  document.querySelectorAll("[data-tilt]").forEach(card => {
    card.addEventListener("pointermove", e => {
      if (!finePointer) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });

  // Magnetic micro-interaction for primary buttons
  if (finePointer) {
    document.querySelectorAll(".button-light, .nav-cta").forEach(button => {
      button.addEventListener("pointermove", e => {
        const r = button.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });
      button.addEventListener("pointerleave", () => { button.style.transform = ""; });
    });
  }

  // Gentle pointer parallax on large page hero circles
  if (finePointer) {
    document.addEventListener("pointermove", e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      document.documentElement.style.setProperty("--parallax-x", `${x}px`);
      document.documentElement.style.setProperty("--parallax-y", `${y}px`);
    }, { passive: true });
  }
});


// Central contact form setting. Replace only the URL below if the contact form changes.
const CONTACT_FORM_URL = "https://forms.gle/Xz2CtqApPugpg7gf8";

function setupContactLinks(){
  document.querySelectorAll("[data-contact-link]").forEach(link=>{
    if(CONTACT_FORM_URL && /^https?:\/\//i.test(CONTACT_FORM_URL)){
      link.href=CONTACT_FORM_URL;
      link.target="_blank";
      link.rel="noopener noreferrer";
      link.removeAttribute("aria-disabled");
    }else{
      link.href="#";
      link.setAttribute("aria-disabled","true");
      link.addEventListener("click",e=>e.preventDefault());
    }
  });
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupContactLinks);
else setupContactLinks();
