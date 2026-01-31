// main.ts
import { initBurgerMenu } from './ts/components/hamburger';
import { initHeaderScrollAnimation } from './ts/components/header';
import { initCustomSelect } from './ts/components/customSelect';
import { initCalculator } from './ts/components/calculator';
import accordion from './ts/components/accordion';
import infinitySlider from './ts/animations/infinitySlider';
import { initGoogleMap } from './ts/API/googleMap';

if (document.getElementById('google-map')) {
  initGoogleMap();
}

initCustomSelect();
if (document.querySelector('header')) {
  initBurgerMenu();
  initHeaderScrollAnimation();
}
if (document.querySelector('.accordion')) accordion();
if (document.querySelector('.about__infinity-slider')) infinitySlider();

if (document.getElementById('rates-table')) {
  import('./ts/components/ratesTable').then((m) => m.initRatesTable());
}

if (document.querySelector('.calculator')) {
  initCalculator();
}
