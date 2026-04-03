import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class AccordionAnimations {
  static init(isReducedMotion: boolean): void {
    const accordionSection = document.querySelector('.accordion');
    if (!accordionSection) return;

    if (isReducedMotion) return;

    const items = accordionSection.querySelectorAll('.accordion__item');
    gsap.set(items, { autoAlpha: 0, y: 15 });

    ScrollTrigger.create({
      trigger: accordionSection,
      start: 'top 70%',
      animation: gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      }),
    });
  }
}
