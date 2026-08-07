const BUSINESS_EMAIL = "guizanimohamed831@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${BUSINESS_EMAIL}`;

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".main-nav");
const langButton = document.querySelector(".lang-btn");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const submitButton = form?.querySelector('button[type="submit"]');

// Automatically use French when the visitor's browser/device prefers French.
// English is the default for every other language.
const preferredLocale = (navigator.languages && navigator.languages.length
  ? navigator.languages[0]
  : navigator.language || "en").toLowerCase();
let language = preferredLocale.startsWith("fr") ? "fr" : "en";

const messages = {
  en: {
    sending: "Sending your request…",
    success: "Thank you! Your request was sent successfully.",
    error: "The message could not be sent. Please try again or contact me by phone.",
    button: "Send request"
  },
  fr: {
    sending: "Envoi de votre demande…",
    success: "Merci! Votre demande a été envoyée avec succès.",
    error: "Le message n’a pas pu être envoyé. Veuillez réessayer ou me contacter par téléphone.",
    button: "Envoyer la demande"
  }
};

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

function applyLanguage(nextLanguage) {
  language = nextLanguage === "fr" ? "fr" : "en";
  document.documentElement.lang = language;

  if (langButton) {
    langButton.textContent = language === "en" ? "FR" : "EN";
    langButton.setAttribute(
      "aria-label",
      language === "en" ? "Passer au français" : "Switch to English"
    );
  }

  document.querySelectorAll("[data-en][data-fr]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  if (formStatus) formStatus.textContent = "";
}

// Apply the visitor's preferred language as soon as the page loads.
applyLanguage(language);

langButton?.addEventListener("click", () => {
  applyLanguage(language === "en" ? "fr" : "en");
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);

  // Bots often fill hidden fields. Real visitors never see this input.
  if (data.get("_honey")) return;

  const payload = {
    name: data.get("name"),
    email: data.get("email"),
    business: data.get("business"),
    package: data.get("package"),
    message: data.get("message"),
    _replyto: data.get("email"),
    _subject: `New MG Web Studio request from ${data.get("name")}`,
    _template: "table",
    _url: window.location.href
  };

  submitButton.disabled = true;
  submitButton.textContent = messages[language].sending;
  formStatus.className = "form-status sending";
  formStatus.textContent = messages[language].sending;

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Form submission failed");
    }

    form.reset();
    formStatus.className = "form-status success";
    formStatus.textContent = messages[language].success;
  } catch (error) {
    console.error(error);
    formStatus.className = "form-status error";
    formStatus.textContent = messages[language].error;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = messages[language].button;
  }
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
