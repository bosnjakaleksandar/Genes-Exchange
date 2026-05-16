import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class AccordionAnimations {
  static init(isReducedMotion: boolean): void {
    const accordionSection = document.querySelector('.accordion');
    if (!accordionSection) return;

    const topWrapper = accordionSection.querySelector('.accordion__top-wrapper');
    const items = accordionSection.querySelectorAll('.accordion__item');

    if (isReducedMotion) {
      gsap.set([topWrapper, ...items], { autoAlpha: 1, clearProps: 'transform' });
      return;
    }

    gsap.set(topWrapper, { autoAlpha: 0, y: 24 });
    gsap.set(items, { autoAlpha: 0, y: 18 });

    ScrollTrigger.create({
      trigger: accordionSection.querySelector('.accordion__container') || accordionSection,
      start: 'top 50%',
      once: true,
      animation: gsap
        .timeline()
        .to(topWrapper, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
        })
        .to(
          items,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.2,
            ease: 'power3.out',
          },
          '-=0.35'
        ),
    });
  }
}
