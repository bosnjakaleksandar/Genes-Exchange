export interface CurrencyRate {
  currency: string;
  currencyImage: string;
  buyRate: number;
  sellRate: number;
  lastUpdate: string;
}

interface RatesResponse {
  rates: CurrencyRate[];
  lastUpdate: string;
}

class DateFormatter {
  private static readonly DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Belgrade',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  };

  static formatBelgrade(dateString?: string): string {
    let dateStr = dateString;

    if (dateStr && !dateStr.includes('Z') && !dateStr.includes('+')) {
      dateStr += 'Z';
    }

    const date = dateStr ? new Date(dateStr) : new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', this.DEFAULT_OPTIONS);
    const parts = formatter.formatToParts(date);

    const day = parts.find((p) => p.type === 'day')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const year = parts.find((p) => p.type === 'year')?.value;
    const hour = parts.find((p) => p.type === 'hour')?.value;
    const minute = parts.find((p) => p.type === 'minute')?.value;

    return `${day}.${month}.${year} ${hour}:${minute}`;
  }
}

export class RatesService {
  private static readonly SUPABASE_URL = import.meta.env.SUPABASE_DATABASE_URL as string;
  private static readonly SUPABASE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;

  private static readonly EMPTY_RESPONSE: RatesResponse = {
    rates: [],
    lastUpdate: 'N/A',
  };

  static async fetchRates(): Promise<RatesResponse> {
    try {
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/rates?select=currency,currencyImage,buyRate,sellRate,sent_at&order=id.asc`,
        {
          headers: {
            apikey: this.SUPABASE_KEY,
            Authorization: `Bearer ${this.SUPABASE_KEY}`,
          },
        }
      );

      const data = await response.json();

      if (!Array.isArray(data)) {
        return this.EMPTY_RESPONSE;
      }

      const rates = data.map((row: any) => ({
        currency: row.currency || '',
        currencyImage: row.currencyImage || '',
        buyRate: parseFloat(row.buyRate) || 0,
        sellRate: parseFloat(row.sellRate) || 0,
        lastUpdate: DateFormatter.formatBelgrade(row.sent_at),
      }));

      const latestSentAt = data
        .map((row: any) => row.sent_at)
        .filter(Boolean)
        .sort()
        .reverse()[0];

      const lastUpdate = latestSentAt
        ? DateFormatter.formatBelgrade(latestSentAt)
        : 'N/A';

      return { rates, lastUpdate };
    } catch (error) {
      console.error('Error fetching rates:', error);
      return this.EMPTY_RESPONSE;
    }
  }
}
