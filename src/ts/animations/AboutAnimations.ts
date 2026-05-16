import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class AboutAnimations {
  static init(isReducedMotion: boolean): void {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;

    if (isReducedMotion) {
      gsap.set('.about__title, .about__description, .about__link, .about__currency-card', {
        autoAlpha: 1,
        clearProps: 'transform',
      });
      return;
    }

    const aboutContainer = aboutSection.querySelector('.about__container');
    const aboutTitle = aboutSection.querySelector('.about__title');
    const aboutDesc = aboutSection.querySelector('.about__description');
    const aboutLink = aboutSection.querySelector('.about__link');
    const currencyCards = aboutSection.querySelectorAll('.about__currency-card');

    gsap.set([aboutTitle, aboutDesc, aboutLink], { autoAlpha: 0, y: 28 });
    gsap.set(currencyCards, { autoAlpha: 0, y: 24, scale: 0.96 });

    ScrollTrigger.create({
      trigger: aboutContainer,
      start: 'top 50%',
      once: true,
      animation: gsap
        .timeline()
        .to([aboutTitle, aboutDesc, aboutLink], {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power3.out',
        })
        .to(
          currencyCards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.06,
            ease: 'power3.out',
          },
          '-=0.25'
        ),
    });
  }
}
