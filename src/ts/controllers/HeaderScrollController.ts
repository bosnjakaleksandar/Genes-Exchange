export class HeaderScrollController {
  private readonly header: HTMLElement;
  private lastScrollY = window.scrollY;
  private ticking = false;

  constructor() {
    this.header = document.querySelector('header') as HTMLElement;

    if (!this.header) return;

    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  }

  private onScroll(): void {
    if (this.ticking) return;

    this.ticking = true;
    requestAnimationFrame(() => {
      this.handleScroll();
      this.ticking = false;
    });
  }

  private handleScroll(): void {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      this.header.classList.add('scrolled');
      const scrollProgress = Math.min((currentScrollY - 50) / 100, 1);
      this.setBackground(0.85 * scrollProgress, 10 * scrollProgress);
    } else {
      this.header.classList.remove('scrolled');
      const scrollProgress = currentScrollY / 50;
      this.setBackground(0.85 * scrollProgress, 10 * scrollProgress);
    }

    if (currentScrollY > this.lastScrollY && currentScrollY > 50) {
      this.header.style.transform = 'translateY(-100%)';
      this.header.style.transition = 'transform 0.3s ease';
    } else {
      this.header.style.transform = 'translateY(0)';
      this.header.style.transition = 'transform 0.3s ease';
    }

    this.lastScrollY = currentScrollY;
  }

  private setBackground(opacity: number, blur: number): void {
    this.header.style.setProperty('--header-bg-opacity', opacity.toString());
    this.header.style.setProperty('--header-blur', `${blur}px`);
  }
}
