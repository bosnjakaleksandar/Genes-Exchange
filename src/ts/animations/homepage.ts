import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function initHomepageAnimations() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReducedMotion) {
    gsap.set('.hero__content, .hero__euro-rate', { autoAlpha: 1 });
    gsap.set('.info__content, .info__image', { autoAlpha: 1 });
    gsap.set('.calculator__wrapper, .calculator__background, .calculator__banknotes', { autoAlpha: 1 });
    gsap.set('.about__title, .about__description', { autoAlpha: 1 });
    return;
  }

  // --- Hero Animations --- //
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  gsap.set('.hero__content', { autoAlpha: 1 });
  
  heroTl.fromTo(['.hero__title', '.hero__description', '.hero__button'], 
    { autoAlpha: 0, x: -40, rotationY: 5 }, 
    { autoAlpha: 1, x: 0, rotationY: 0, duration: 1.5, stagger: 0.2, delay: 0.1 }
  )
  .fromTo('.hero__euro-rate', 
    { autoAlpha: 0, y: 40 }, 
    { autoAlpha: 1, y: 0, duration: 1.5 }, 
    "-=1"
  );

  // --- Info Components Animations --- //
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
      animation: gsap.timeline()
        .to(content, { autoAlpha: 1, x: 0, duration: 1.2, ease: 'power3.out' })
        .to(image, { autoAlpha: 1, x: 0, duration: 1.2, ease: 'power3.out' }, '-=0.8')
    });
  });

  // --- Calculator Animations --- //
  const calculatorSection = document.querySelector('.calculator');
  if (calculatorSection) {
    const calcBg = calculatorSection.querySelector('.calculator__background');
    const calcWrapper = calculatorSection.querySelector('.calculator__wrapper');
    const calcBanknotes = calculatorSection.querySelector('.calculator__banknotes');

    gsap.set(calcBg, { autoAlpha: 0, scale: 1.05 });
    gsap.set([calcBanknotes, calcWrapper], { autoAlpha: 0, y: 30 });
    
    ScrollTrigger.create({
      trigger: calculatorSection,
      start: 'top 70%',
      animation: gsap.timeline()
        .to(calcBg, { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power2.out' })
        .to([calcBanknotes, calcWrapper], { 
            autoAlpha: 1, 
            y: 0, 
            duration: 1.2, 
            stagger: 0.2,
            ease: 'power4.out' 
        }, '-=1.2')
    });
  }

  // --- About Section Animations --- //
  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
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
        ease: 'power3.out' 
      })
    });
  }

  // --- Accordion Animations --- //
  const accordionSection = document.querySelector('.accordion');
  if (accordionSection) {
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
            ease: 'power2.out'
        })
    });
  }
}

