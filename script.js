const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const whatsappNumber = "233537071320";
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("anitas-tombrown-theme");

if (savedTheme === "dark" || savedTheme === "light") {
  document.documentElement.dataset.theme = savedTheme;
}

function updateThemeToggle() {
  const isDark = document.documentElement.dataset.theme === "dark";
  if (!themeToggle) return;

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  themeToggle.title = `Switch to ${isDark ? "light" : "dark"} mode`;
}

updateThemeToggle();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("anitas-tombrown-theme", nextTheme);
    updateThemeToggle();
  });
}

const revealElements = document.querySelectorAll(
  ".section-heading, .menu-card, .about-image, .about-copy, .contact-content, .order-form, .order-aside, .contact-card, .contact-form"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => {
    element.classList.add("reveal-on-scroll");
    revealObserver.observe(element);
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });
}

document.querySelectorAll("[data-whatsapp-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const formType = form.dataset.whatsappForm;
    const message = formType === "order"
      ? [
          "Hello Anita, I would like to place an order for Anita's Tombrown.",
          `Name: ${formData.get("name")}`,
          `Order: ${formData.get("item")}`,
          `Quantity: ${formData.get("quantity")}`,
          `Preference: ${formData.get("fulfillment")}`,
          formData.get("notes") ? `Notes: ${formData.get("notes")}` : ""
        ].filter(Boolean).join("\n")
      : [
          "Hello Anita, I have a question about Anita's Tombrown.",
          `Name: ${formData.get("name")}`,
          formData.get("phone") ? `Phone: ${formData.get("phone")}` : "",
          `Message: ${formData.get("message")}`
        ].filter(Boolean).join("\n");

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });
});