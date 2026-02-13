import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Thermometer, Droplets, Sun, Moon, CloudSun, CloudMoon, CloudRain, CloudLightning, Cloud } from 'lucide-react';

const SystemStatusHeader: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState({ 
    temp: '--', 
    humidity: '--', 
    condition: 'Loading...', 
    isDay: 1,
    code: 0
  });

  useEffect(() => {
    // 1. Digital Clock Timer (Updates every second)
    const timer = setInterval(() => setTime(new Date()), 1000);

    // 2. Weather Fetch using Open-Meteo (Free, No Key required)
    const fetchWeather = async () => {
      try {
        // Coordinates for Bengaluru (12.9716° N, 77.5946° E)
        const lat = 12.9716;
        const long = 77.5946;
        
        // Added is_day to params
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,weather_code,is_day`
        );
        
        if (!response.ok) throw new Error('Weather fetch failed');
        
        const data = await response.json();
        const current = data.current;
        const isDay = current.is_day;
        const code = current.weather_code;
        
        // Map WMO Weather Codes to descriptions
        // https://open-meteo.com/en/docs
        let condition = 'Clear';
        
        if (code === 0) condition = isDay ? 'Sunny' : 'Clear';
        else if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
        else if (code >= 45 && code <= 48) condition = 'Foggy';
        else if (code >= 51 && code <= 57) condition = 'Drizzle';
        else if (code >= 61 && code <= 67) condition = 'Rain';
        else if (code >= 71 && code <= 77) condition = 'Snow';
        else if (code >= 80 && code <= 82) condition = 'Showers';
        else if (code >= 95 && code <= 99) condition = 'Thunderstorm';
        
        setWeather({ 
            temp: Math.round(current.temperature_2m).toString(), 
            humidity: current.relative_humidity_2m.toString(),
            condition: condition,
            isDay: isDay,
            code: code
        });

      } catch (error) {
        console.error("Weather API Error:", error);
        // Fallback
        setWeather({ temp: '--', humidity: '--', condition: 'Unavailable', isDay: 1, code: -1 });
      }
    };

    // Initial fetch and periodic update every 15 mins (900000 ms)
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 900000);

    return () => {
        clearInterval(timer);
        clearInterval(weatherTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false }); // 24-hour format HH:MM:SS
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getWeatherIcon = () => {
    const { code, isDay } = weather;
    
    // Loading/Error
    if (code === -1) return <Cloud size={18} className="text-slate-400" />;

    // 0: Clear
    if (code === 0) return isDay ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-400" />;
    
    // 1-3: Cloudy
    if (code >= 1 && code <= 3) return isDay ? <CloudSun size={18} className="text-slate-500" /> : <CloudMoon size={18} className="text-slate-400" />;
    
    // Rain/Drizzle/Showers
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={18} className="text-blue-400" />;
    
    // Thunderstorm
    if (code >= 95) return <CloudLightning size={18} className="text-purple-500" />;
    
    // Default (Fog/Snow/Etc)
    return <Cloud size={18} className="text-slate-400" />;
  };

  return (
    // Glassmorphism Container
    <header className="sticky top-0 z-40 w-full bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-center transition-all duration-300 gap-3">
      
      {/* Left: Date & Time */}
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2 text-slate-600 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
          <Calendar size={16} className="text-emerald-600" />
          <span className="font-medium text-xs lg:text-sm">{formatDate(time)}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Clock size={18} className="text-emerald-600" />
          <span className="font-mono font-bold text-lg text-slate-800 min-w-[80px]">{formatTime(time)}</span>
        </div>
      </div>

      {/* Right: Weather Widget */}
      <div className="flex items-center gap-4 bg-white/60 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-default">
        
        {/* Location Indicator */}
        <div className="flex items-center gap-2 text-slate-500 border-r border-slate-200 pr-4 hidden sm:flex">
           <MapPin size={14} className="text-slate-400" />
           <span className="text-xs font-bold uppercase tracking-wider">Bengaluru</span>
        </div>

        {/* Condition */}
        <div className="flex items-center gap-2 text-slate-700">
          {getWeatherIcon()}
          <span className="text-sm font-medium hidden sm:block">{weather.condition}</span>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-1 text-slate-900 font-bold pl-2 border-l border-slate-200 sm:border-none sm:pl-0">
          <Thermometer size={16} className="text-rose-500" />
          <span>{weather.temp}°C</span>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-1 text-slate-500 text-xs hidden lg:flex">
            <Droplets size={12} className="text-blue-400"/>
            <span>{weather.humidity}%</span>
        </div>
      </div>
    </header>
  );
};

export default SystemStatusHeader;