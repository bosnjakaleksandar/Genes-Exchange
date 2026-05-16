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
      const container = section.querySelector('.info__container');
      const isReverse = section.querySelector('.info__container--reverse') !== null;
      const content = section.querySelector('.info__content');
      const image = section.querySelector('.info__image');

      if (!container || !content || !image) return;

      gsap.set(content, { autoAlpha: 0, y: 34, x: isReverse ? 20 : -20 });
      gsap.set(image, {
        autoAlpha: 0,
        y: 34,
        x: isReverse ? -20 : 20,
        scale: 0.96,
        clipPath: 'inset(8% round 12px)',
      });

      ScrollTrigger.create({
        trigger: container,
        start: 'top 50%',
        once: true,
        animation: gsap
          .timeline()
          .to(content, {
            autoAlpha: 1,
            y: 0,
            x: 0,
            duration: 0.85,
            ease: 'power3.out',
          })
          .to(
            image,
            {
              autoAlpha: 1,
              y: 0,
              x: 0,
              scale: 1,
              clipPath: 'inset(0% round 12px)',
              duration: 0.95,
              ease: 'power3.out',
            },
            '-=0.55'
          ),
      });
    });
  }
}
