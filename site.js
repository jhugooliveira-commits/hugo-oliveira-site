
const BOOKING_URL = "https://calendar.app.google/Kig3jaQkufHSZWHf6";

document.querySelectorAll("[data-menu]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("[data-nav]").classList.toggle("open");
  });
});
document.querySelectorAll("[data-nav] a").forEach(a => {
  a.addEventListener("click", () => document.querySelector("[data-nav]").classList.remove("open"));
});

const modal = document.querySelector("#bookingModal");
const iframe = document.querySelector("#bookingFrame");
const openModal = () => {
  if (!modal) return;
  iframe.src = BOOKING_URL;
  modal.classList.add("open");
  document.body.classList.add("no-scroll");
};
const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("open");
  document.body.classList.remove("no-scroll");
  iframe.src = "about:blank";
};
document.querySelectorAll("[data-book]").forEach(btn => btn.addEventListener("click", openModal));
document.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", closeModal));
if (modal) modal.addEventListener("click", e => { if(e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeModal(); });

document.querySelectorAll(".faq-q").forEach(q => {
  q.addEventListener("click", () => {
    const item = q.parentElement;
    item.classList.toggle("open");
  });
});
