
const BOOKING_URL = "https://calendar.app.google/Kig3jaQkufHSZWHf6";

document.querySelectorAll("[data-menu]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("[data-nav]").classList.toggle("open");
  });
});
document.querySelectorAll("[data-nav] a").forEach(a => {
  a.addEventListener("click", () => document.querySelector("[data-nav]").classList.remove("open"));
});

document.querySelectorAll("[data-book]").forEach(button => {
  button.addEventListener("click", () => window.open(BOOKING_URL, "_blank", "noopener,noreferrer"));
});

document.querySelectorAll(".faq-q").forEach(q => {
  q.addEventListener("click", () => {
    const item = q.parentElement;
    item.classList.toggle("open");
  });
});
