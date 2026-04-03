import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class CalculatorAnimations {
  static init(isReducedMotion: boolean): void {
    const calculatorSection = document.querySelector('.calculator');
    if (!calculatorSection) return;

    if (isReducedMotion) {
      gsap.set('.calculator__wrapper, .calculator__background, .calculator__banknotes', {
        autoAlpha: 1,
      });
      return;
    }

    const calcBg = calculatorSection.querySelector('.calculator__background');
    const calcWrapper = calculatorSection.querySelector('.calculator__wrapper');
    const calcBanknotes = calculatorSection.querySelector('.calculator__banknotes');

    gsap.set(calcBg, { autoAlpha: 0, scale: 1.05 });
    gsap.set([calcBanknotes, calcWrapper], { autoAlpha: 0, y: 30 });

    ScrollTrigger.create({
      trigger: calculatorSection,
      start: 'top 70%',
      animation: gsap
        .timeline()
        .to(calcBg, { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power2.out' })
        .to(
          [calcBanknotes, calcWrapper],
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power4.out',
          },
          '-=1.2'
        ),
    });
  }
}
