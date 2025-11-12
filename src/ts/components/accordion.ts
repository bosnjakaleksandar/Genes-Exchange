const accordion = () => {
  const accordions = document.querySelectorAll('.js-accordion');

  accordions.forEach((accordion) => {
    const accordionHeader = accordion.querySelector('.js-accordion-header')! as HTMLElement;
    const accordionBody = accordion.querySelector('.js-accordion-body')! as HTMLElement;
    const accordionBodyInner = accordion.querySelector('.js-accordion-body-inner')! as HTMLElement;

    accordionHeader.addEventListener('click', () => {
      if (accordion.classList.contains('active')) {
        accordion.classList.remove('active');
        accordionBody.style.height = '0px';
        return;
      }

      document.querySelectorAll('.js-accordion.active').forEach((openAccordion) => {
        openAccordion.classList.remove('active');
        const openBody = openAccordion.querySelector('.js-accordion-body') as HTMLElement;
        if (openBody) {
          openBody.style.height = '0px';
        }
      });

      accordion.classList.add('active');
      const accordionBodyInnerHeight = accordionBodyInner.getBoundingClientRect().height;
      accordionBody.style.height = `${accordionBodyInnerHeight}px`;
    });
  });
};

const initAccordion = () => {
  accordion();
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initAccordion();
} else {
  document.addEventListener('DOMContentLoaded', initAccordion);
}
window.addEventListener('pageshow', initAccordion);

export default accordion;
