import { Chart, registerables } from 'chart.js';
import { fetchHistory } from '../API/useRatesHistory';

Chart.register(...registerables);

let chartInstance: Chart | null = null;
let selectedCurrency = '';
let selectedType: 'buy' | 'sell' = 'buy';
let selectedInterval: 'day' | 'week' | 'month' | 'year' = 'day';
let detailsOpen = false;
let isMobile = false;

// Skeleton loader state
let dataLoaded = false;
let minTimeElapsed = false;

const updateIsMobile = () => {
  isMobile = window.innerWidth <= 1024;
};

const checkAndShowTable = () => {
  const skeleton = document.getElementById('table-skeleton');
  const table = document.getElementById('rates-table');

  if (dataLoaded && minTimeElapsed) {
    if (skeleton && table) {
      skeleton.style.display = 'none';
      table.style.display = 'table';
    }
  } else {
    // Skeleton ostaje dok se podaci ne učitaju
    if (skeleton && table) {
      skeleton.style.display = '';
      table.style.display = 'none';
    }
  }
};

const handleRowClick = (
  currency: string,
  buyRate: number,
  sellRate: number,
  currencyImage: string
) => {
  selectedCurrency = currency;

  // Update header
  const currencyEl = document.getElementById('selected-currency');
  const flagEl = document.getElementById('selected-flag') as HTMLImageElement;

  if (currencyEl) currencyEl.textContent = currency;
  if (flagEl && currencyImage) {
    flagEl.src = currencyImage;
    flagEl.alt = currency;
    flagEl.style.display = 'block';
  }

  // Highlight selected row
  document.querySelectorAll('.rates__table-row').forEach((row) => {
    row.classList.remove('rates__table-row--selected');
  });
  document
    .querySelector(`[data-currency="${currency}"]`)
    ?.classList.add('rates__table-row--selected');

  if (isMobile) {
    detailsOpen = true;
    document.querySelector('.rates')?.classList.add('rates--details-open');
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.style.display = 'flex';
  }

  fetchAndRenderChart();
};

const handleBack = () => {
  detailsOpen = false;
  document.querySelector('.rates')?.classList.remove('rates--details-open');
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.style.display = 'none';
};

const handleTypeChange = (type: 'buy' | 'sell') => {
  selectedType = type;

  // Update active button
  document.querySelectorAll('[data-type]').forEach((btn) => {
    btn.classList.toggle('rates__interval-button--active', btn.getAttribute('data-type') === type);
  });

  // Update label
  const label = document.getElementById('selected-type-label');
  if (label) label.textContent = type === 'buy' ? 'Kupovni' : 'Prodajni';

  fetchAndRenderChart();
};

const handleIntervalChange = (interval: 'day' | 'week' | 'month' | 'year') => {
  selectedInterval = interval;

  // Update active button
  document.querySelectorAll('[data-interval]').forEach((btn) => {
    btn.classList.toggle(
      'rates__interval-button--active',
      btn.getAttribute('data-interval') === interval
    );
  });

  fetchAndRenderChart();
};

const fetchAndRenderChart = async () => {
  if (!selectedCurrency) return;

  const loadingEl = document.getElementById('chart-loading');
  const chartEl = document.getElementById('rates-chart');

  if (loadingEl) loadingEl.style.display = 'flex';
  if (chartEl) chartEl.style.display = 'none';

  const startTime = Date.now();
  const minLoadingTime = 1500;

  try {
    const history = await fetchHistory(selectedCurrency, selectedInterval);

    // Osiguraj minimalno vreme za loader
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

    await new Promise((resolve) => setTimeout(resolve, remainingTime));

    renderChart(history);
  } catch (error) {
    console.error('Error fetching history:', error);
  } finally {
    // Sakrij loader i prikaži chart
    if (loadingEl) loadingEl.style.display = 'none';
    if (chartEl) chartEl.style.display = 'block';
  }
};

const renderChart = (history: any[]) => {
  const canvas = document.getElementById('rates-chart') as HTMLCanvasElement;
  if (!canvas || !history.length) return;

  const labels = history.map((entry) => entry.recorded_at.replace('T', ' ').substring(0, 16));
  const data = history.map((entry) => (selectedType === 'buy' ? entry.buyRate : entry.sellRate));

  const minY = Math.min(...data);
  const maxY = Math.max(...data);
  const padding = Math.max((maxY - minY) * 0.1, 0.5);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(canvas, {
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
};

// Initialize
export const initRatesTable = () => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);

  // Minimalno vreme za skeleton (1.5 sekunde)
  setTimeout(() => {
    minTimeElapsed = true;
    checkAndShowTable();
  }, 1500);

  // Označi da su podaci učitani (podaci su već tu jer je Astro server-side renderovao stranicu)
  dataLoaded = true;
  checkAndShowTable();

  // Set first currency as selected (only on desktop)
  if (!isMobile) {
    const firstRow = document.querySelector('.rates__table-row');
    if (firstRow) {
      const currency = firstRow.getAttribute('data-currency') || '';
      const buyRate = parseFloat(firstRow.getAttribute('data-buy-rate') || '0');
      const sellRate = parseFloat(firstRow.getAttribute('data-sell-rate') || '0');
      const currencyImage = firstRow.getAttribute('data-currency-image') || '';
      handleRowClick(currency, buyRate, sellRate, currencyImage);
    }
  }

  // Add event listeners
  document.querySelectorAll('.rates__table-row').forEach((row) => {
    row.addEventListener('click', () => {
      const currency = row.getAttribute('data-currency') || '';
      const buyRate = parseFloat(row.getAttribute('data-buy-rate') || '0');
      const sellRate = parseFloat(row.getAttribute('data-sell-rate') || '0');
      const currencyImage = row.getAttribute('data-currency-image') || '';
      handleRowClick(currency, buyRate, sellRate, currencyImage);
    });
  });

  document.getElementById('back-btn')?.addEventListener('click', handleBack);

  document.querySelectorAll('[data-type]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type') as 'buy' | 'sell';
      handleTypeChange(type);
    });
  });

  document.querySelectorAll('[data-interval]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const interval = btn.getAttribute('data-interval') as 'day' | 'week' | 'month' | 'year';
      handleIntervalChange(interval);
    });
  });
};
