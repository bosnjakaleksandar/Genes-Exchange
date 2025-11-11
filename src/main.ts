import './scss/main.scss';

import { initBurgerMenu } from './ts/components/hamburger';
import { initHeaderScrollAnimation } from './ts/components/header';

initBurgerMenu();
initHeaderScrollAnimation();

if (document.querySelector('.custom-select')) {
  import('./ts/components/customSelect').then(({ initCustomSelect }) => {
    initCustomSelect();
  });
}

if (document.querySelector('.rates-table') || document.querySelector('[data-rates-table]')) {
  import('./ts/components/ratesTable').then(({ initRatesTable }) => {
    initRatesTable();
  });
}
