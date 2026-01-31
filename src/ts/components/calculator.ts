type Action = 'buy' | 'sell';

export const initCalculator = () => {
  const toggleButtons = document.querySelectorAll('.calculator__toggle-btn');
  const currencySelect = document.getElementById('currency-select') as HTMLSelectElement;
  const amountInput = document.getElementById('amount-input') as HTMLInputElement;
  const resultLabel = document.getElementById('result-label') as HTMLElement;
  const resultValue = document.getElementById('result-value') as HTMLElement;

  if (!toggleButtons.length || !currencySelect || !amountInput || !resultLabel || !resultValue) {
    return;
  }

  let currentAction: Action = 'buy';

  const banknotes = document.querySelectorAll('.calculator__banknote');
  const placeholder = document.getElementById('banknote-placeholder');
  const placeholderText = placeholder?.querySelector('p');
  const lang = document.documentElement.lang || 'sr';
  const initialPlaceholderText = lang === 'en' ? 'Select currency' : 'Izaberite valutu';

  function fadeOut(element: HTMLElement, callback?: () => void) {
    element.classList.add('calculator__banknote--fading');
    setTimeout(() => {
      element.classList.add('calculator__banknote--hidden');
      if (callback) callback();
    }, 300);
  }

  function fadeOutPlaceholder(callback?: () => void) {
    if (!placeholder) return;
    placeholder.classList.add('calculator__placeholder--fading');
    setTimeout(() => {
      placeholder.classList.add('calculator__placeholder--hidden');
      if (callback) callback();
    }, 300);
  }

  function fadeIn(element: HTMLElement) {
    element.classList.remove('calculator__banknote--hidden');
    element.classList.add('calculator__banknote--fading');
    setTimeout(() => {
      element.classList.remove('calculator__banknote--fading');
    }, 10);
  }

  function fadeInPlaceholder() {
    if (!placeholder) return;
    placeholder.classList.remove('calculator__placeholder--hidden');
    placeholder.classList.add('calculator__placeholder--fading');
    setTimeout(() => {
      placeholder.classList.remove('calculator__placeholder--fading');
    }, 10);
  }

  function showBanknote(currency: string) {
    const banknoteId = `banknote-${currency.toLowerCase()}`;
    const targetBanknote = document.getElementById(banknoteId);
    const selectedOption = currencySelect.options[currencySelect.selectedIndex];
    const currencyFullName = selectedOption?.getAttribute('data-name') || currency;

    banknotes.forEach((banknote) => {
      if (!banknote.classList.contains('calculator__banknote--hidden')) {
        fadeOut(banknote as HTMLElement);
      }
    });

    if (targetBanknote) {
      fadeOutPlaceholder(() => {
        fadeIn(targetBanknote);
      });
    } else {
      if (placeholderText) {
        placeholderText.textContent = currencyFullName;
      }
      setTimeout(() => {
        fadeInPlaceholder();
      }, 300);
    }
  }

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleButtons.forEach((b) => b.classList.remove('calculator__toggle-btn--active'));
      btn.classList.add('calculator__toggle-btn--active');
      currentAction = btn.getAttribute('data-action') as Action;
      updateResultLabel();
      calculateResult();
    });
  });

  currencySelect.addEventListener('change', () => {
    const selectedCurrency = currencySelect.value;
    if (selectedCurrency) {
      showBanknote(selectedCurrency);
    } else {
      banknotes.forEach((banknote) => {
        if (!banknote.classList.contains('calculator__banknote--hidden')) {
          fadeOut(banknote as HTMLElement);
        }
      });
      if (placeholderText) {
        placeholderText.textContent = initialPlaceholderText;
      }
      setTimeout(() => {
        fadeInPlaceholder();
      }, 300);
    }
    calculateResult();
  });

  amountInput.addEventListener('input', calculateResult);

  function updateResultLabel() {
    const lang = document.documentElement.lang || 'sr';
    if (currentAction === 'buy') {
      resultLabel.textContent = lang === 'en' ? 'You pay' : 'Plaćate';
    } else {
      resultLabel.textContent = lang === 'en' ? 'You get' : 'Dobijate';
    }
  }

  function calculateResult() {
    const selectedOption = currencySelect.options[currencySelect.selectedIndex];
    const amount = parseFloat(amountInput.value);

    if (!selectedOption || !selectedOption.value || isNaN(amount) || amount <= 0) {
      resultValue.textContent = '0.00 RSD';
      return;
    }

    const buyRate = parseFloat(selectedOption.getAttribute('data-buy') || '0');
    const sellRate = parseFloat(selectedOption.getAttribute('data-sell') || '0');

    let result = 0;

    if (currentAction === 'buy') {
      result = amount * sellRate;
    } else {
      result = amount * buyRate;
    }

    resultValue.textContent = `${result.toFixed(2)} RSD`;
  }

  updateResultLabel();
};
