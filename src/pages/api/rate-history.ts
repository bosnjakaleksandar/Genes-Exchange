import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const SUPABASE_URL = import.meta.env.SUPABASE_DATABASE_URL as string;
  const SUPABASE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;

  const currency = context.url.searchParams.get('currency');
  const interval = context.url.searchParams.get('interval') as 'day' | 'week' | 'month' | 'year';

  if (!currency || !interval) {
    return new Response(JSON.stringify({ error: 'Missing currency or interval' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  let fromDate = new Date();
  switch (interval) {
    case 'day':
      fromDate.setDate(fromDate.getDate() - 1);
      break;
    case 'week':
      fromDate.setDate(fromDate.getDate() - 7);
      break;
    case 'month':
      fromDate.setMonth(fromDate.getMonth() - 1);
      break;
    case 'year':
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      break;
  }

  const fromISO = fromDate.toISOString();
  const supabaseUrl = `${SUPABASE_URL}/rest/v1/rate_history?currency=eq.${currency}&recorded_at=gte.${fromISO}&order=recorded_at.asc`;

  try {
    const response = await fetch(supabaseUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const data = await response.json();

    // If no data, return last available rate duplicated
    if (Array.isArray(data) && data.length === 0) {
      const lastRateUrl = `${SUPABASE_URL}/rest/v1/rate_history?currency=eq.${currency}&order=recorded_at.desc&limit=1`;
      const lastRateResponse = await fetch(lastRateUrl, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const lastRateData = await lastRateResponse.json();

      if (Array.isArray(lastRateData) && lastRateData.length > 0) {
        const lastRate = lastRateData[0];
        const now = new Date().toISOString();
        return new Response(
          JSON.stringify([
            { ...lastRate, recorded_at: fromISO },
            { ...lastRate, recorded_at: now },
          ]),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return new Response(JSON.stringify(Array.isArray(data) ? data : []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching rate history:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch rate history' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
