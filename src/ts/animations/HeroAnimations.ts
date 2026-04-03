import { gsap } from 'gsap';

export class HeroAnimations {
  static init(isReducedMotion: boolean): void {
    if (isReducedMotion) {
      gsap.set('.hero__content, .hero__euro-rate', { autoAlpha: 1 });
      return;
    }

    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    gsap.set('.hero__content', { autoAlpha: 1 });

    heroTl
      .fromTo(
        ['.hero__title', '.hero__description', '.hero__button'],
        { autoAlpha: 0, x: -40, rotationY: 5 },
        { autoAlpha: 1, x: 0, rotationY: 0, duration: 1.5, stagger: 0.2, delay: 0.1 }
      )
      .fromTo(
        '.hero__euro-rate',
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 1.5 },
        '-=1'
      );
  }
}
