export interface RateHistoryEntry {
  currency: string;
  currencyImage: string;
  buyRate: number;
  sellRate: number;
  recorded_at: string;
}

export type HistoryInterval = 'day' | 'week' | 'month' | 'year';

export class RatesHistoryService {
  static async fetchHistory(
    currency: string,
    interval: HistoryInterval
  ): Promise<RateHistoryEntry[]> {
    const url = `/api/rate-history?currency=${encodeURIComponent(currency)}&interval=${interval}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch rate history: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching rate history:', error);
      return [];
    }
  }
}
