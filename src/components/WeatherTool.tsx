import React, { useState, useEffect } from 'react';
import { CloudSun, Search, MapPin, Wind, Droplets, Sun, CloudRain } from 'lucide-react';

interface WeatherForecastItem {
  day: string;
  temp: number;
  condition: string;
}

interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  forecast: WeatherForecastItem[];
  isFallback?: boolean;
}

export default function WeatherTool() {
  const [city, setCity] = useState('New York');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (targetLoc: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: targetLoc })
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve atmospheric coordinates.');
      }
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Environmental connection failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('New York');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const getConditionIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('sunny') || c.includes('clear')) return <Sun className="w-8 h-8 text-amber-500" />;
    if (c.includes('rain') || c.includes('shower')) return <CloudRain className="w-8 h-8 text-sky-400" />;
    return <CloudSun className="w-8 h-8 text-zinc-400" />;
  };

  return (
    <div id="weather" className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <CloudSun className="w-6 h-6 text-sky-550 text-sky-500" />
          Smart Weather Forecast
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Fetch live meteorological vectors and standard 3-day conditions with real-time AI grounding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input search column */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2.5">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Enter city, e.g. London, Paris..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-sky-500 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" /> Go
            </button>
          </form>

          {/* Quick city presets */}
          <div className="bg-zinc-50/50 dark:bg-zinc-800/15 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Preset Global Capitals</h4>
            <div className="flex gap-2 flex-wrap">
              {['London', 'New Delhi', 'Tokyo', 'San Francisco', 'Paris'].map((cap) => (
                <button
                  key={cap}
                  onClick={() => { setCity(cap); fetchWeather(cap); }}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 text-[11px] py-1 px-2.5 rounded-lg hover:border-sky-500 cursor-pointer transition-all"
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details display panel */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs min-h-[300px] flex flex-col justify-between relative overflow-hidden">
          {loading ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-sky-500/25 border-t-sky-550 border-t-sky-500 rounded-full animate-spin" />
              <p className="text-xs text-zinc-400 font-mono mt-4">Piping meteorological feeds from Gemini live search engines...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 px-4">
              <p className="font-bold text-sm">Feeds Connection Failed</p>
              <p className="text-xs text-zinc-400 mt-2 font-mono">{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-zinc-850 dark:text-zinc-100 flex items-center gap-1.5 font-sans">
                    <MapPin className="w-5 h-5 text-sky-500" /> {data.location}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-mono font-bold">{data.condition}</p>
                </div>
                {data.isFallback && (
                  <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 text-[9px] py-0.5 px-2 rounded-md font-mono shrink-0 font-bold">
                    Preset Feeds
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  {getConditionIcon(data.condition)}
                  <span className="text-5xl font-black text-zinc-900 dark:text-zinc-50 pl-2 font-mono">{data.temp}°C</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <div>
                      <span className="block text-[10px] text-zinc-400 font-bold uppercase">Humidity</span>
                      <span className="font-bold font-mono text-zinc-700 dark:text-zinc-300">{data.humidity}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Wind className="w-4 h-4 text-zinc-450" />
                    <div>
                      <span className="block text-[10px] text-zinc-400 font-bold uppercase">Wind Speed</span>
                      <span className="font-bold font-mono text-zinc-700 dark:text-zinc-300">{data.wind} km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-day forecast forecast blocks list */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">3-Day Condition Forecast</h4>
                <div className="grid grid-cols-3 gap-3">
                  {data.forecast && data.forecast.map((fc, idx) => (
                    <div key={idx} className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 text-center flex flex-col items-center">
                      <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">{fc.day}</span>
                      <div className="my-1.5">{getConditionIcon(fc.condition)}</div>
                      <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 font-mono">{fc.temp}°C</span>
                      <span className="text-[9px] text-zinc-400 mt-0.5 truncate max-w-full font-semibold">{fc.condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-zinc-400 text-xs py-20 text-center font-mono">No atmospheric charts parsed. Enter a city name above.</p>
          )}

          <div className="text-[10px] text-zinc-400 font-mono text-right pl-2 mt-4 pt-4 border-t border-zinc-100/35 dark:border-zinc-800/30">
            Powered by Gemini Search Grounding Matrix
          </div>
        </div>
      </div>
    </div>
  );
}
