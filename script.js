const BUSINESS_EMAIL = "guizanimohamed831@gmail.com";

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".main-nav");
const langButton = document.querySelector(".lang-btn");
const form = document.querySelector("#contact-form");
let language = "en";

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

langButton?.addEventListener("click", () => {
  language = language === "en" ? "fr" : "en";
  document.documentElement.lang = language;
  langButton.textContent = language === "en" ? "FR" : "EN";

  document.querySelectorAll("[data-en][data-fr]").forEach((element) => {
    element.textContent = element.dataset[language];
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent(`Website request from ${data.get("name")}`);
  const body = encodeURIComponent(
`Name: ${data.get("name")}
Email: ${data.get("email")}
Business: ${data.get("business")}

Project details:
${data.get("message")}`
  );
  window.location.href = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("#year").textContent = new Date().getFullYear();
