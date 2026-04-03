import { RatesHistoryService } from '../services/RatesHistoryService';
import type { HistoryInterval } from '../services/RatesHistoryService';

type RateType = 'buy' | 'sell';

export class RatesTableController {
  private chartInstance: any = null;
  private ChartConstructor: any = null;
  private selectedCurrency = '';
  private selectedType: RateType = 'buy';
  private selectedInterval: HistoryInterval = 'day';
  private detailsOpen = false;
  private isMobile = false;

  private dataLoaded = false;
  private minTimeElapsed = false;

  private readonly skeleton: HTMLElement | null;
  private readonly table: HTMLElement | null;
  private readonly loadingEl: HTMLElement | null;
  private readonly chartCanvas: HTMLCanvasElement | null;
  private readonly currencyEl: HTMLElement | null;
  private readonly flagEl: HTMLImageElement | null;
  private readonly typeLabelEl: HTMLElement | null;
  private readonly backBtn: HTMLElement | null;
  private readonly ratesSection: Element | null;

  constructor() {
    this.skeleton = document.getElementById('table-skeleton');
    this.table = document.getElementById('rates-table');
    this.loadingEl = document.getElementById('chart-loading');
    this.chartCanvas = document.getElementById('rates-chart') as HTMLCanvasElement;
    this.currencyEl = document.getElementById('selected-currency');
    this.flagEl = document.getElementById('selected-flag') as HTMLImageElement;
    this.typeLabelEl = document.getElementById('selected-type-label');
    this.backBtn = document.getElementById('back-btn');
    this.ratesSection = document.querySelector('.rates');

    this.init();
  }

  private init(): void {
    this.updateIsMobile();
    window.addEventListener('resize', () => this.updateIsMobile());

    this.dataLoaded = true;
    this.checkAndShowTable();

    const startSkeletonTimer = () => {
      setTimeout(() => {
        this.minTimeElapsed = true;
        this.checkAndShowTable();
      }, 1500);
    };

    if (!this.isMobile) {
      const firstRow = document.querySelector('.rates__table-row');
      if (firstRow) {
        const currency = firstRow.getAttribute('data-currency') || '';
        const buyRate = parseFloat(firstRow.getAttribute('data-buy-rate') || '0');
        const sellRate = parseFloat(firstRow.getAttribute('data-sell-rate') || '0');
        const currencyImage = firstRow.getAttribute('data-currency-image') || '';
        startSkeletonTimer();
        this.handleRowClick(currency, buyRate, sellRate, currencyImage);
      }
    } else {
      startSkeletonTimer();
    }

    this.bindEvents();
  }

  private bindEvents(): void {
    document.querySelectorAll('.rates__table-row').forEach((row) => {
      row.addEventListener('click', () => {
        const currency = row.getAttribute('data-currency') || '';
        const buyRate = parseFloat(row.getAttribute('data-buy-rate') || '0');
        const sellRate = parseFloat(row.getAttribute('data-sell-rate') || '0');
        const currencyImage = row.getAttribute('data-currency-image') || '';
        this.handleRowClick(currency, buyRate, sellRate, currencyImage);
      });
    });

    this.backBtn?.addEventListener('click', () => this.handleBack());

    document.querySelectorAll('[data-type]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type') as RateType;
        this.handleTypeChange(type);
      });
    });

    document.querySelectorAll('[data-interval]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const interval = btn.getAttribute('data-interval') as HistoryInterval;
        this.handleIntervalChange(interval);
      });
    });
  }

  private updateIsMobile(): void {
    this.isMobile = window.innerWidth <= 1024;
  }

  private checkAndShowTable(): void {
    if (this.dataLoaded && this.minTimeElapsed) {
      if (this.skeleton && this.table) {
        this.skeleton.style.display = 'none';
        this.table.style.display = 'table';
      }
    } else {
      if (this.skeleton && this.table) {
        this.skeleton.style.display = '';
        this.table.style.display = 'none';
      }
    }
  }

  private handleRowClick(
    currency: string,
    buyRate: number,
    sellRate: number,
    currencyImage: string
  ): void {
    this.selectedCurrency = currency;

    if (this.currencyEl) this.currencyEl.textContent = currency;
    if (this.flagEl && currencyImage) {
      this.flagEl.src = currencyImage;
      this.flagEl.alt = currency;
      this.flagEl.style.display = 'block';
    }

    document.querySelectorAll('.rates__table-row').forEach((row) => {
      row.classList.remove('rates__table-row--selected');
    });
    document
      .querySelector(`[data-currency="${currency}"]`)
      ?.classList.add('rates__table-row--selected');

    if (this.isMobile) {
      this.detailsOpen = true;
      this.ratesSection?.classList.add('rates--details-open');
      if (this.backBtn) this.backBtn.style.display = 'flex';
    }

    this.fetchAndRenderChart();
  }

  private handleBack(): void {
    this.detailsOpen = false;
    this.ratesSection?.classList.remove('rates--details-open');
    if (this.backBtn) this.backBtn.style.display = 'none';
  }

  private handleTypeChange(type: RateType): void {
    this.selectedType = type;

    document.querySelectorAll('[data-type]').forEach((btn) => {
      btn.classList.toggle(
        'rates__interval-button--active',
        btn.getAttribute('data-type') === type
      );
    });

    if (this.typeLabelEl) {
      this.typeLabelEl.textContent = type === 'buy' ? 'Kupovni' : 'Prodajni';
    }

    this.fetchAndRenderChart();
  }

  private handleIntervalChange(interval: HistoryInterval): void {
    this.selectedInterval = interval;

    document.querySelectorAll('[data-interval]').forEach((btn) => {
      btn.classList.toggle(
        'rates__interval-button--active',
        btn.getAttribute('data-interval') === interval
      );
    });

    this.fetchAndRenderChart();
  }

  private async ensureChartLoaded(): Promise<any> {
    if (this.ChartConstructor) return this.ChartConstructor;

    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    this.ChartConstructor = Chart;
    return Chart;
  }

  private async fetchAndRenderChart(): Promise<void> {
    if (!this.selectedCurrency) return;

    if (this.loadingEl) this.loadingEl.style.display = 'flex';
    if (this.chartCanvas) this.chartCanvas.style.display = 'none';

    this.minTimeElapsed = false;
    setTimeout(() => {
      this.minTimeElapsed = true;
      this.checkAndShowTable();
    }, 1500);

    const startTime = Date.now();
    const minLoadingTime = 1500;

    try {
      const history = await RatesHistoryService.fetchHistory(
        this.selectedCurrency,
        this.selectedInterval
      );

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      await this.renderChart(history);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      if (this.loadingEl) this.loadingEl.style.display = 'none';
      if (this.chartCanvas) this.chartCanvas.style.display = 'block';
    }
  }

  private async renderChart(history: any[]): Promise<void> {
    if (!this.chartCanvas || !history.length) return;

    const Chart = await this.ensureChartLoaded();

    const labels = history.map((entry) => entry.recorded_at.replace('T', ' ').substring(0, 16));
    const data = history.map((entry) =>
      this.selectedType === 'buy' ? entry.buyRate : entry.sellRate
    );

    const minY = Math.min(...data);
    const maxY = Math.max(...data);
    const padding = Math.max((maxY - minY) * 0.1, 0.5);

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(this.chartCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data,
            borderColor: '#e0a501',
            backgroundColor: 'rgba(224, 165, 1, 0.1)',
            tension: 0.4,
            pointRadius: 0,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            display: false,
            min: minY - padding,
            max: maxY + padding,
          },
          x: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            intersect: false,
            mode: 'index',
            callbacks: {
              label: function (context: any) {
                return `Kurs: ${context.parsed.y?.toFixed(2) || 'N/A'}`;
              },
              title: function (context: any) {
                const isoString = context[0].label.replace(' ', 'T') + 'Z';
                const date = new Date(isoString);
                const serbianTime = new Intl.DateTimeFormat('sr-RS', {
                  timeZone: 'Europe/Belgrade',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(date);
                return `Vreme: ${serbianTime}`;
              },
            },
          },
        },
      },
    });
  }

  destroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }
}
