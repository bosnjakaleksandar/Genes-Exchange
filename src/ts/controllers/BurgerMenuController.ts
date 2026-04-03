export class BurgerMenuController {
  private readonly burger: HTMLElement;
  private readonly nav: HTMLElement;
  private readonly body: HTMLElement;

  constructor() {
    this.burger = document.querySelector('.burger') as HTMLElement;
    this.nav = document.querySelector('.header__list') as HTMLElement;
    this.body = document.body;

    if (!this.burger || !this.nav) return;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.burger.addEventListener('click', () => this.toggle());

    this.burger.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.burger.click();
      }
    });
  }

  private toggle(): void {
    const isActive = this.burger.classList.toggle('active');

    if (isActive) {
      this.open();
    } else {
      this.close();
    }
  }

  private open(): void {
    this.nav.classList.add('active');
    this.nav.style.display = 'flex';
    this.nav.style.opacity = '0';
    this.nav.style.transition = 'opacity 400ms';

    setTimeout(() => {
      this.nav.style.opacity = '1';
    }, 10);

    this.body.style.overflow = 'hidden';
  }

  private close(): void {
    this.nav.style.opacity = '1';
    this.nav.style.transition = 'opacity 400ms';

    setTimeout(() => {
      this.nav.style.opacity = '0';
    }, 10);

    setTimeout(() => {
      this.nav.style.display = 'none';
      this.nav.style.transition = '';
      this.nav.classList.remove('active');
    }, 400);

    this.body.style.overflow = '';
  }
}
