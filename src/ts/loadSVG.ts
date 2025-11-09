const svgIconModules = import.meta.glob("/src/svg/*.svg", {
  query: "?raw",
  import: "default",
});

async function loadSVG(element: HTMLElement, svgName: string) {
  const path = `/src/svg/${svgName}.svg`;

  if (svgIconModules[path]) {
    try {
      const svgText = await svgIconModules[path]();
      element.insertAdjacentHTML("afterbegin", svgText + " ");
    } catch (error) {
      console.error(`Error dynamically importing SVG "${svgName}.svg":`, error);
    }
  } else {
    console.error(`SVG module not found for: ${svgName}`);
  }
}

function initSVGLoader() {
  document.addEventListener("DOMContentLoaded", () => {
    const svgElements = document.querySelectorAll(
      "[data-svg]"
    ) as NodeListOf<HTMLElement>;

    svgElements.forEach((element) => {
      const svgName = element.getAttribute("data-svg");
      if (svgName) {
        loadSVG(element, svgName);
      }
    });
  });
}

export { loadSVG, initSVGLoader };
