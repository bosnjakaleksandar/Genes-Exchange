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
    const calcContainer = calculatorSection.querySelector('.calculator__container');
    const calcWrapper = calculatorSection.querySelector('.calculator__wrapper');
    const calcBanknotes = calculatorSection.querySelector('.calculator__banknotes');

    if (!calcBg || !calcContainer || !calcWrapper || !calcBanknotes) return;

    gsap.set(calcBg, { autoAlpha: 0, scale: 1.05 });
    gsap.set(calcBanknotes, { autoAlpha: 0, y: 34, rotate: -2, scale: 0.96 });
    gsap.set(calcWrapper, { autoAlpha: 0, y: 34, scale: 0.98 });

    ScrollTrigger.create({
      trigger: calcContainer,
      start: 'top 60%',
      once: true,
      animation: gsap
        .timeline()
        .to(calcBg, { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power2.out' })
        .to(
          calcBanknotes,
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.75'
        )
        .to(
          calcWrapper,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.65'
        ),
    });
  }
}
