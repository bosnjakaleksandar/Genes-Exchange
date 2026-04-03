import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class InfoAnimations {
  static init(isReducedMotion: boolean): void {
    if (isReducedMotion) {
      gsap.set('.info__content, .info__image', { autoAlpha: 1 });
      return;
    }

    const infoSections = document.querySelectorAll('.info');

    infoSections.forEach((section) => {
      const isReverse = section.querySelector('.info__container--reverse') !== null;
      const content = section.querySelector('.info__content');
      const image = section.querySelector('.info__image');

      gsap.set(content, { autoAlpha: 0, x: isReverse ? 40 : -40 });
      gsap.set(image, { autoAlpha: 0, x: isReverse ? -40 : 40 });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        animation: gsap
          .timeline()
          .to(content, { autoAlpha: 1, x: 0, duration: 1.2, ease: 'power3.out' })
          .to(image, { autoAlpha: 1, x: 0, duration: 1.2, ease: 'power3.out' }, '-=0.8'),
      });
    });
  }
}
