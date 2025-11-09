export function initHeaderScrollAnimation() {
  let lastScrollY = window.scrollY;
  const header = document.querySelector("header") as HTMLElement | null;

  function animateHeaderBackground(opacity: number, blur: number) {
    if (!header) return;
    header.style.setProperty("--header-bg-opacity", opacity.toString());
    header.style.setProperty("--header-blur", `${blur}px`);
  }

  function handleHeaderScroll() {
    if (!header) return;
    const currentScrollY = window.scrollY;

    // Smooth animacija za blur i background
    if (currentScrollY > 50) {
      header.classList.add("scrolled");
      // Postepeno povećavanje opacity i blur-a
      const scrollProgress = Math.min((currentScrollY - 50) / 100, 1);
      animateHeaderBackground(0.85 * scrollProgress, 10 * scrollProgress);
    } else {
      header.classList.remove("scrolled");
      // Postepeno smanjivanje opacity i blur-a
      const scrollProgress = currentScrollY / 50;
      animateHeaderBackground(0.85 * scrollProgress, 10 * scrollProgress);
    }

    // Sakrij/prikaži header na osnovu smera skrolovanja
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      header.style.transform = "translateY(-100%)";
      header.style.transition = "transform 0.3s ease";
    } else {
      header.style.transform = "translateY(0)";
      header.style.transition = "transform 0.3s ease";
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener("scroll", handleHeaderScroll);
}
