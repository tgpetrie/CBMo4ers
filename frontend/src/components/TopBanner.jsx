import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TopBanner() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchTop24h = async () => {
      try {
        const res = await axios.get('http://localhost:8000/24h-gainers');
        setCoins(res.data);
      } catch (err) {
        console.error('Failed to fetch 24h gainers', err);
      }
    };
    fetchTop24h();
    const interval = setInterval(fetchTop24h, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-purple-800 text-white overflow-hidden whitespace-nowrap py-2 px-4">
      <div className="animate-marquee flex space-x-6">
        {coins.map((coin, idx) => (
          <a
            key={idx}
            href={coin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-400 text-sm font-semibold"
          >
            {coin.symbol}: <span className="text-blue-300">{coin.gain}%</span>
          </a>
        ))}
      </div>
    </div>
  );
}