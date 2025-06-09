import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TopBanner() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchTop24h = async () => {
      try {
        const res = await axios.get('http://localhost:8001/24h-gainers');
        setCoins(res.data);
      } catch (err) {
        console.error('Failed to fetch 24h gainers', err);
      }
    };
    fetchTop24h();
    const interval = setInterval(fetchTop24h, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-900/90 to-indigo-900/80 text-white overflow-hidden whitespace-nowrap py-3 border-b border-indigo-800/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="animate-marquee flex justify-center space-x-8">
        {coins.map((coin, idx) => (
          <a
            key={idx}
            href={coin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition-colors duration-200 text-sm font-medium flex items-center"
          >
            <span className="text-gray-300 mr-1">{coin.symbol}</span>
            <span className={`${coin.gain > 0 ? 'text-green-400' : 'text-red-400'} font-semibold px-1 rounded-sm ${coin.gain > 0 ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
              {coin.gain > 0 ? '+' : ''}{coin.gain}%
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}