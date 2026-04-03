export class CustomSelectController {
  private readonly customSelects: NodeListOf<HTMLElement>;

  private static readonly SLUG_MAP: Record<string, string> = {
    '/cesta-pitanja': '/en/faq',
    '/en/faq': '/cesta-pitanja',
    '/kursna-lista': '/en/exchange-rates',
    '/en/exchange-rates': '/kursna-lista',
    '/': '/en',
    '/en': '/',
  };

  constructor() {
    this.customSelects = document.querySelectorAll('.custom-select') as NodeListOf<HTMLElement>;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.customSelects.forEach((customSelect) => {
      const trigger = customSelect.querySelector('.custom-select__trigger') as HTMLElement;
      const options = customSelect.querySelector('.custom-select__options') as HTMLElement;
      const optionItems = customSelect.querySelectorAll(
        '.custom-select__option'
      ) as NodeListOf<HTMLElement>;

      if (!trigger || !options) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSelect(customSelect);
      });

      optionItems.forEach((option) => {
        option.addEventListener('click', (e) => {
          this.handleOptionClick(option, customSelect, e);
        });
      });
    });

    document.addEventListener('click', () => this.closeAll());
  }

  private toggleSelect(customSelect: HTMLElement): void {
    customSelect.classList.toggle('active');

    this.customSelects.forEach((otherSelect) => {
      if (otherSelect !== customSelect) {
        otherSelect.classList.remove('active');
      }
    });
  }

  private handleOptionClick(
    option: HTMLElement,
    customSelect: HTMLElement,
    e: Event
  ): void {
    if (option.querySelector('.custom-select__disabled')) {
      e.stopPropagation();
      return;
    }

    const value = option.dataset.value;
    const img = option.querySelector('img') as HTMLImageElement;

    if (img) {
      const allFlags = document.querySelectorAll(
        '.custom-select__flag'
      ) as NodeListOf<HTMLImageElement>;
      allFlags.forEach((f) => {
        f.src = img.src;
        f.alt = img.alt;
      });
    }

    customSelect.classList.remove('active');

    const targetPath = this.resolveTargetPath(value || '');
    window.location.href = targetPath;
  }

  private resolveTargetPath(value: string): string {
    let currentPath = window.location.pathname;

    if (currentPath.length > 1 && currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }
    currentPath = currentPath.toLowerCase();

    if (value === 'en') {
      return CustomSelectController.SLUG_MAP[currentPath]
        || (currentPath === '/' ? '/en' : '/en' + currentPath);
    }

    return CustomSelectController.SLUG_MAP[currentPath]
      || currentPath.replace(/^\/en/, '') || '/';
  }

  private closeAll(): void {
    this.customSelects.forEach((customSelect) => {
      customSelect.classList.remove('active');
    });
  }
}
