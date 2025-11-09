export interface CurrencyRate {
  currency: string;
  currencyImage: string;
  buyRate: number;
  sellRate: number;
  lastUpdate: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY as string;

const formatDateTime = (dateString?: string): string => {
  const date = dateString ? new Date(dateString) : new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
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
