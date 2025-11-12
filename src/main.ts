import './scss/main.scss';
import { initBurgerMenu } from './ts/components/hamburger';
import { initHeaderScrollAnimation } from './ts/components/header';
import { initCustomSelect } from './ts/components/customSelect';
import { initRatesTable } from './ts/components/ratesTable';

initBurgerMenu();
initHeaderScrollAnimation();
initCustomSelect();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRatesTable);
} else {
  initRatesTable();
}
