import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function HistoricalChart({ fromCurrency, toCurrency }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchHistoricalData() {
      if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
        setData([]);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const from = fromCurrency.toLowerCase();
        const to = toCurrency.toLowerCase();
        const dates = [];

        // Generate past 14 days dates (YYYY-MM-DD)
        for (let i = 14; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          dates.push(d.toISOString().split('T')[0]);
        }

        // Fetch historical rates concurrently across the past 14 days
        const requests = dates.map(async (date) => {
          try {
            const res = await fetch(
              `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${from}.json`
            );
            if (!res.ok) return null;
            const json = await res.json();

            if (json[from] && json[from][to]) {
              const dateObj = new Date(date);
              return {
                date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                rate: parseFloat(json[from][to].toFixed(4)),
              };
            }
          } catch {
            return null;
          }
          return null;
        });

        const results = await Promise.all(requests);
        const filteredData = results.filter((item) => item !== null);

        if (filteredData.length > 0) {
          setData(filteredData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching historical chart data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchHistoricalData();
  }, [fromCurrency, toCurrency]);

  if (loading) {
    return <div className="text-gray-400 my-8">Loading historical chart...</div>;
  }

  if (error || data.length === 0) {
    return (
      <div className="text-gray-400 my-8">
        Historical chart unavailable for {fromCurrency}/{toCurrency}.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white/5 p-4 rounded-xl border border-white/10 mt-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-sm font-semibold dark:text-gray-300">
          {fromCurrency} to {toCurrency} Exchange Rate (Past 14 Days)
        </h3>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} />

            <YAxis
              domain={['auto', 'auto']}
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              orientation="right"
              tickFormatter={(val) => val.toFixed(3)}
            />

            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              labelStyle={{ color: '#94A3B8' }}
              itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
              formatter={(value) => [value, 'Rate']}
            />

            <Area
              type="monotone"
              dataKey="rate"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}