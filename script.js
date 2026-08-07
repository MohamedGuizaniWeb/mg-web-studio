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

  const selectedPackage = document.querySelector(".package-option.selected");
  if (selectedPackage && packageTitle && packageSub) {
    packageTitle.textContent = language === "fr"
      ? selectedPackage.dataset.titleFr
      : selectedPackage.dataset.titleEn;

    packageSub.textContent = `${language === "fr" ? selectedPackage.dataset.priceFr : selectedPackage.dataset.priceEn} • ${language === "fr" ? selectedPackage.dataset.descFr : selectedPackage.dataset.descEn}`;
  }

  const selectedBusiness = document.querySelector(".business-option.selected");
  if (selectedBusiness && businessTitle && businessSub) {
    businessTitle.textContent = language === "fr"
      ? selectedBusiness.dataset.titleFr
      : selectedBusiness.dataset.titleEn;

    businessSub.textContent = language === "fr"
      ? selectedBusiness.dataset.descFr
      : selectedBusiness.dataset.descEn;
  }
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
    if (businessValue) businessValue.value = "";
    if (businessTitle) businessTitle.textContent = language === "fr" ? "Choisir un type d’entreprise" : "Choose a business type";
    if (businessSub) businessSub.textContent = language === "fr"
      ? "Choisissez la catégorie qui correspond à votre projet"
      : "Select the business category that fits your project";
    businessOptions.forEach(item => {
      item.classList.remove("selected");
      item.setAttribute("aria-selected", "false");
    });
    if (packageValue) packageValue.value = "";
    if (packageTitle) packageTitle.textContent = language === "fr" ? "Choisir un forfait" : "Choose a package";
    if (packageSub) packageSub.textContent = language === "fr"
      ? "Choisissez l’option adaptée à votre projet"
      : "Select the option that fits your project";
    packageOptions.forEach(item => {
      item.classList.remove("selected");
      item.setAttribute("aria-selected", "false");
    });
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


// Custom business selector
const businessBtn = document.getElementById("business-select-btn");
const businessMenu = document.getElementById("business-menu");
const businessValue = document.getElementById("business-value");
const businessTitle = document.getElementById("business-selected-title");
const businessSub = document.getElementById("business-selected-sub");
const businessOptions = document.querySelectorAll(".business-option");

function closeBusinessMenu() {
  if (!businessMenu || !businessBtn) return;
  businessMenu.classList.remove("open");
  businessBtn.setAttribute("aria-expanded", "false");
}

businessBtn?.addEventListener("click", () => {
  const open = !businessMenu.classList.contains("open");
  businessMenu.classList.toggle("open", open);
  businessBtn.setAttribute("aria-expanded", String(open));
});

function selectBusiness(option) {
  if (!option || !businessValue || !businessTitle || !businessSub) return;

  const fr = document.documentElement.lang === "fr";
  businessValue.value = option.dataset.value;
  businessTitle.textContent = fr ? option.dataset.titleFr : option.dataset.titleEn;
  businessSub.textContent = fr ? option.dataset.descFr : option.dataset.descEn;

  businessOptions.forEach(item => {
    item.classList.remove("selected");
    item.setAttribute("aria-selected", "false");
  });

  option.classList.add("selected");
  option.setAttribute("aria-selected", "true");
  closeBusinessMenu();
}

businessOptions.forEach(option => {
  option.addEventListener("click", () => selectBusiness(option));
});

// Custom package selector
const packageBtn = document.getElementById("package-select-btn");
const packageMenu = document.getElementById("package-menu");
const packageValue = document.getElementById("package-value");
const packageTitle = document.getElementById("package-selected-title");
const packageSub = document.getElementById("package-selected-sub");
const packageOptions = document.querySelectorAll(".package-option");

function closePackageMenu() {
  if (!packageMenu || !packageBtn) return;
  packageMenu.classList.remove("open");
  packageBtn.setAttribute("aria-expanded", "false");
}

packageBtn?.addEventListener("click", () => {
  const open = !packageMenu.classList.contains("open");
  packageMenu.classList.toggle("open", open);
  packageBtn.setAttribute("aria-expanded", String(open));
});

function selectPackage(option) {
  if (!option || !packageValue || !packageTitle || !packageSub) return;

  const fr = document.documentElement.lang === "fr";
  packageValue.value = option.dataset.value;
  packageTitle.textContent = fr ? option.dataset.titleFr : option.dataset.titleEn;
  packageSub.textContent = `${fr ? option.dataset.priceFr : option.dataset.priceEn} • ${fr ? option.dataset.descFr : option.dataset.descEn}`;

  packageOptions.forEach(item => {
    item.classList.remove("selected");
    item.setAttribute("aria-selected", "false");
  });

  option.classList.add("selected");
  option.setAttribute("aria-selected", "true");
  closePackageMenu();
}

packageOptions.forEach(option => {
  option.addEventListener("click", () => selectPackage(option));
});

// Pricing buttons automatically preselect the matching package in the form.
document.querySelectorAll(".package-quote-btn").forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.package;
    const option = [...packageOptions].find(item => item.dataset.value === value);
    if (option) selectPackage(option);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".business-field")) closeBusinessMenu();
  if (!event.target.closest(".package-field")) closePackageMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBusinessMenu();
    closePackageMenu();
  }
});

