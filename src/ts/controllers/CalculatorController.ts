type Action = 'buy' | 'sell';

export class CalculatorController {
  private readonly toggleButtons: NodeListOf<Element>;
  private readonly currencySelect: HTMLSelectElement;
  private readonly amountInput: HTMLInputElement;
  private readonly resultLabel: HTMLElement;
  private readonly resultValue: HTMLElement;
  private readonly banknotes: NodeListOf<Element>;
  private readonly placeholder: HTMLElement | null;
  private readonly placeholderText: HTMLParagraphElement | null;
  private readonly lang: string;
  private readonly initialPlaceholderText: string;

  private currentAction: Action = 'buy';

  constructor() {
    this.toggleButtons = document.querySelectorAll('.calculator__toggle-btn');
    this.currencySelect = document.getElementById('currency-select') as HTMLSelectElement;
    this.amountInput = document.getElementById('amount-input') as HTMLInputElement;
    this.resultLabel = document.getElementById('result-label') as HTMLElement;
    this.resultValue = document.getElementById('result-value') as HTMLElement;
    this.banknotes = document.querySelectorAll('.calculator__banknote');
    this.placeholder = document.getElementById('banknote-placeholder');
    this.placeholderText = this.placeholder?.querySelector('p') ?? null;
    this.lang = document.documentElement.lang || 'sr';
    this.initialPlaceholderText = this.lang === 'en' ? 'Select currency' : 'Izaberite valutu';

    if (!this.toggleButtons.length || !this.currencySelect || !this.amountInput ||
        !this.resultLabel || !this.resultValue) {
      return;
    }

    this.bindEvents();
    this.updateResultLabel();
  }

  private bindEvents(): void {
    this.toggleButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.toggleButtons.forEach((b) => b.classList.remove('calculator__toggle-btn--active'));
        btn.classList.add('calculator__toggle-btn--active');
        this.currentAction = btn.getAttribute('data-action') as Action;
        this.updateResultLabel();
        this.calculateResult();
      });
    });

    this.currencySelect.addEventListener('change', () => {
      const selectedCurrency = this.currencySelect.value;

      if (selectedCurrency) {
        this.showBanknote(selectedCurrency);
      } else {
        this.hideAllBanknotes();

        if (this.placeholderText) {
          this.placeholderText.textContent = this.initialPlaceholderText;
        }
        setTimeout(() => this.fadeInPlaceholder(), 300);
      }

      this.calculateResult();
    });

    this.amountInput.addEventListener('input', () => this.calculateResult());
  }

  private fadeOut(element: HTMLElement, callback?: () => void): void {
    element.classList.add('calculator__banknote--fading');
    setTimeout(() => {
      element.classList.add('calculator__banknote--hidden');
      if (callback) callback();
    }, 300);
  }

  private fadeOutPlaceholder(callback?: () => void): void {
    if (!this.placeholder) return;
    this.placeholder.classList.add('calculator__placeholder--fading');
    setTimeout(() => {
      this.placeholder!.classList.add('calculator__placeholder--hidden');
      if (callback) callback();
    }, 300);
  }

  private fadeIn(element: HTMLElement): void {
    element.classList.remove('calculator__banknote--hidden');
    element.classList.add('calculator__banknote--fading');
    setTimeout(() => {
      element.classList.remove('calculator__banknote--fading');
    }, 10);
  }

  private fadeInPlaceholder(): void {
    if (!this.placeholder) return;
    this.placeholder.classList.remove('calculator__placeholder--hidden');
    this.placeholder.classList.add('calculator__placeholder--fading');
    setTimeout(() => {
      this.placeholder!.classList.remove('calculator__placeholder--fading');
    }, 10);
  }

  private hideAllBanknotes(): void {
    this.banknotes.forEach((banknote) => {
      if (!banknote.classList.contains('calculator__banknote--hidden')) {
        this.fadeOut(banknote as HTMLElement);
      }
    });
  }

  private showBanknote(currency: string): void {
    const banknoteId = `banknote-${currency.toLowerCase()}`;
    const targetBanknote = document.getElementById(banknoteId);
    const selectedOption = this.currencySelect.options[this.currencySelect.selectedIndex];
    const currencyFullName = selectedOption?.getAttribute('data-name') || currency;

    this.hideAllBanknotes();

    if (targetBanknote) {
      this.fadeOutPlaceholder(() => {
        this.fadeIn(targetBanknote);
      });
    } else {
      if (this.placeholderText) {
        this.placeholderText.textContent = currencyFullName;
      }
      setTimeout(() => this.fadeInPlaceholder(), 300);
    }
  }

  private updateResultLabel(): void {
    if (this.currentAction === 'buy') {
      this.resultLabel.textContent = this.lang === 'en' ? 'You pay' : 'Plaćate';
    } else {
      this.resultLabel.textContent = this.lang === 'en' ? 'You get' : 'Dobijate';
    }
  }

  private calculateResult(): void {
    const selectedOption = this.currencySelect.options[this.currencySelect.selectedIndex];
    const amount = parseFloat(this.amountInput.value);

    if (!selectedOption || !selectedOption.value || isNaN(amount) || amount <= 0) {
      this.resultValue.textContent = '0.00 RSD';
      return;
    }

    const buyRate = parseFloat(selectedOption.getAttribute('data-buy') || '0');
    const sellRate = parseFloat(selectedOption.getAttribute('data-sell') || '0');

    const result = this.currentAction === 'buy'
      ? amount * sellRate
      : amount * buyRate;

    this.resultValue.textContent = `${result.toFixed(2)} RSD`;
  }
}
