import './scss/main.scss';
import { initBurgerMenu } from './ts/components/hamburger';
import { initHeaderScrollAnimation } from './ts/components/header';
import { initCustomSelect } from './ts/components/customSelect';
import accordion from './ts/components/accordion';

initCustomSelect();

if (document.querySelector('header')) {
  initBurgerMenu();
}

if (document.querySelector('header')) {
  initHeaderScrollAnimation();
}

if (document.querySelector('.accordion') || document.querySelector('.js-accordion')) {
  accordion();
}

if (document.getElementById('rates-table')) {
  import('./ts/components/ratesTable').then(({ initRatesTable }) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initRatesTable);
    } else {
      initRatesTable();
    }
  });
}
