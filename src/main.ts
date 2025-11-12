import './scss/main.scss';
import { initBurgerMenu } from './ts/components/hamburger';
import { initHeaderScrollAnimation } from './ts/components/header';
import { initCustomSelect } from './ts/components/customSelect';
import { initRatesTable } from './ts/components/ratesTable';
import accordion from './ts/components/accordion';

initBurgerMenu();
initHeaderScrollAnimation();
initCustomSelect();
accordion();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRatesTable);
} else {
  initRatesTable();
}
