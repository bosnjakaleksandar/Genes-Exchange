export interface CurrencyRate {
  currency: string;
  currencyImage: string;
  buyRate: number;
  sellRate: number;
  lastUpdate: string;
}

const SUPABASE_URL = import.meta.env.SUPABASE_DATABASE_URL as string;
const SUPABASE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;

const formatDateTime = (dateString?: string): string => {
  let dateStr = dateString;
  if (dateStr && !dateStr.includes('Z') && !dateStr.includes('+')) {
    dateStr += 'Z';
  }
  const date = dateStr ? new Date(dateStr) : new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Belgrade',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  };

  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(date);

  const day = parts.find((p) => p.type === 'day')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const year = parts.find((p) => p.type === 'year')?.value;
  const hour = parts.find((p) => p.type === 'hour')?.value;
  const minute = parts.find((p) => p.type === 'minute')?.value;

  return `${day}.${month}.${year} ${hour}:${minute}`;
};

export async function fetchRates(): Promise<{ rates: CurrencyRate[]; lastUpdate: string }> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rates?select=currency,currencyImage,buyRate,sellRate,sent_at&order=id.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const data = await response.json();
    if (Array.isArray(data)) {
      const rates = data.map((row: any) => ({
        currency: row.currency || '',
        currencyImage: row.currencyImage || '',
        buyRate: parseFloat(row.buyRate) || 0,
        sellRate: parseFloat(row.sellRate) || 0,
        lastUpdate: formatDateTime(row.sent_at),
      }));
      const latestSentAt = data
        .map((row: any) => row.sent_at)
        .filter(Boolean)
        .sort()
        .reverse()[0];
      const lastUpdate = latestSentAt ? formatDateTime(latestSentAt) : 'N/A';
      return { rates, lastUpdate };
    }
    return { rates: [], lastUpdate: 'N/A' };
  } catch (error) {
    console.error('Error fetching rates:', error);
    return { rates: [], lastUpdate: 'N/A' };
  }
}
