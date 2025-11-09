import './scss/main.scss';
import { initSVGLoader } from './ts/loadSVG';
import { initBurgerMenu } from './ts/components/hamburger';
import { initHeaderScrollAnimation } from './ts/components/header';
import { initCustomSelect } from './ts/components/customSelect';
import { initRatesTable } from './ts/components/ratesTable';

initSVGLoader();
initBurgerMenu();
initHeaderScrollAnimation();
initCustomSelect();
initRatesTable();
