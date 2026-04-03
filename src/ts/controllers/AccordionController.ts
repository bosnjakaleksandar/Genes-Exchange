export class AccordionController {
  private readonly accordions: NodeListOf<Element>;

  constructor() {
    this.accordions = document.querySelectorAll('.js-accordion');
    this.bindEvents();
  }

  private bindEvents(): void {
    this.accordions.forEach((accordion) => {
      const header = accordion.querySelector('.js-accordion-header') as HTMLElement;
      const body = accordion.querySelector('.js-accordion-body') as HTMLElement;
      const bodyInner = accordion.querySelector('.js-accordion-body-inner') as HTMLElement;

      if (!header || !body || !bodyInner) return;

      header.addEventListener('click', () => {
        this.toggle(accordion, body, bodyInner);
      });
    });
  }

  private toggle(accordion: Element, body: HTMLElement, bodyInner: HTMLElement): void {
    if (accordion.classList.contains('active')) {
      accordion.classList.remove('active');
      body.style.height = '0px';
      return;
    }

    this.closeAll();

    accordion.classList.add('active');
    const height = bodyInner.getBoundingClientRect().height;
    body.style.height = `${height}px`;
  }

  private closeAll(): void {
    document.querySelectorAll('.js-accordion.active').forEach((openAccordion) => {
      openAccordion.classList.remove('active');
      const openBody = openAccordion.querySelector('.js-accordion-body') as HTMLElement;
      if (openBody) {
        openBody.style.height = '0px';
      }
    });
  }
}
