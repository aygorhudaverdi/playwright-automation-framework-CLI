// Highlights the current page's nav link. Shared across every page.
document.addEventListener("DOMContentLoaded", () => {
  const here = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("header.site-header nav a").forEach((link) => {
    const target = link.getAttribute("href").split("/").pop();
    if (target === here) {
      link.setAttribute("aria-current", "page");
      link.style.color = "var(--text)";
    }
  });
});
