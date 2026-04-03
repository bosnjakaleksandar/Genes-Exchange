import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class AboutAnimations {
  static init(isReducedMotion: boolean): void {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;

    if (isReducedMotion) {
      gsap.set('.about__title, .about__description', { autoAlpha: 1 });
      return;
    }

    const aboutTitle = aboutSection.querySelector('.about__title');
    const aboutDesc = aboutSection.querySelector('.about__description');
    const aboutLink = aboutSection.querySelector('.about__link');

    gsap.set([aboutTitle, aboutDesc, aboutLink], { autoAlpha: 0, y: 25 });

    ScrollTrigger.create({
      trigger: aboutSection,
      start: 'top 65%',
      animation: gsap.to([aboutTitle, aboutDesc, aboutLink], {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
      }),
    });
  }
}
