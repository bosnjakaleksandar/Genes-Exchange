import type { APIRoute } from 'astro';

export const prerender = false;

type HistoryInterval = 'day' | 'week' | 'month' | 'year';

const VALID_INTERVALS: ReadonlySet<string> = new Set(['day', 'week', 'month', 'year']);

const CACHE_DURATIONS: Record<HistoryInterval, number> = {
  day: 300,     // 5 min
  week: 600,    // 10 min
  month: 1800,  // 30 min
  year: 3600,   // 1 hour
};

function jsonResponse(data: unknown, status: number, cacheMaxAge = 0): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...(cacheMaxAge > 0 && {
        'Cache-Control': `public, max-age=${cacheMaxAge}, s-maxage=${cacheMaxAge}`,
      }),
    },
  });
}

function getDateFrom(interval: HistoryInterval): Date {
  const from = new Date();

  switch (interval) {
    case 'day':
      from.setDate(from.getDate() - 1);
      break;
    case 'week':
      from.setDate(from.getDate() - 7);
      break;
    case 'month':
      from.setMonth(from.getMonth() - 1);
      break;
    case 'year':
      from.setFullYear(from.getFullYear() - 1);
      break;
  }

  return from;
}

export const GET: APIRoute = async (context) => {
  const SUPABASE_URL = import.meta.env.SUPABASE_DATABASE_URL as string;
  const SUPABASE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;

  const currency = context.url.searchParams.get('currency');
  const intervalParam = context.url.searchParams.get('interval');

  if (!currency || !intervalParam || !VALID_INTERVALS.has(intervalParam)) {
    return jsonResponse({ error: 'Missing or invalid currency/interval' }, 400);
  }

  const interval = intervalParam as HistoryInterval;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return jsonResponse({ error: 'Server configuration error' }, 500);
  }

  const supabaseHeaders = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };

  const fromISO = getDateFrom(interval).toISOString();
  const supabaseUrl = `${SUPABASE_URL}/rest/v1/rate_history?currency=eq.${encodeURIComponent(currency)}&recorded_at=gte.${fromISO}&order=recorded_at.asc`;
  const cacheAge = CACHE_DURATIONS[interval];

  try {
    const response = await fetch(supabaseUrl, { headers: supabaseHeaders });
    const data = await response.json();

    if (Array.isArray(data) && data.length === 0) {
      return await fetchFallbackRate(SUPABASE_URL, supabaseHeaders, currency, fromISO, cacheAge);
    }

    return jsonResponse(Array.isArray(data) ? data : [], 200, cacheAge);
  } catch (error) {
    console.error('Error fetching rate history:', error);
    return jsonResponse({ error: 'Failed to fetch rate history' }, 500);
  }
};

async function fetchFallbackRate(
  supabaseUrl: string,
  headers: Record<string, string>,
  currency: string,
  fromISO: string,
  cacheAge: number
): Promise<Response> {
  const lastRateUrl = `${supabaseUrl}/rest/v1/rate_history?currency=eq.${encodeURIComponent(currency)}&order=recorded_at.desc&limit=1`;

  const lastRateResponse = await fetch(lastRateUrl, { headers });
  const lastRateData = await lastRateResponse.json();

  if (Array.isArray(lastRateData) && lastRateData.length > 0) {
    const lastRate = lastRateData[0];
    const now = new Date().toISOString();

    return jsonResponse(
      [
        { ...lastRate, recorded_at: fromISO },
        { ...lastRate, recorded_at: now },
      ],
      200,
      cacheAge
    );
  }

  return jsonResponse([], 200, cacheAge);
}
