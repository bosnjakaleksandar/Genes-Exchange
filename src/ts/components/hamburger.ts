export function initBurgerMenu() {
  const burger = document.querySelector(".burger") as HTMLElement | null;
  const nav = document.querySelector(".header__list") as HTMLElement | null;
  const body = document.body;

  if (!burger || !nav) return;

  function fadeIn(element: HTMLElement, duration = 400) {
    element.style.display = "flex";
    element.style.opacity = "0";
    element.style.transition = `opacity ${duration}ms`;
    setTimeout(() => {
      element.style.opacity = "1";
    }, 10);
  }

  function fadeOut(element: HTMLElement, duration = 400) {
    element.style.opacity = "1";
    element.style.transition = `opacity ${duration}ms`;
    setTimeout(() => {
      element.style.opacity = "0";
    }, 10);
    setTimeout(() => {
      element.style.display = "none";
      element.style.transition = "";
    }, duration);
  }

  burger.addEventListener("click", () => {
    const isActive = burger.classList.toggle("active");

    if (isActive) {
      nav.classList.add("active");
      fadeIn(nav, 400);
      body.style.overflow = "hidden";
    } else {
      fadeOut(nav, 400);
      body.style.overflow = "";
      setTimeout(() => {
        nav.classList.remove("active");
      }, 400);
    }
  });

  burger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      burger.click();
    }
  });
}
