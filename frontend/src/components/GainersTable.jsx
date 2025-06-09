import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GainersTable() {
  const [coins, setCoins] = useState([]);

  const fetchTopMovers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/top-gainers');
      setCoins(res.data);
    } catch (err) {
      console.error('Failed to fetch 3min gainers', err);
    }
  };

  useEffect(() => {
    fetchTopMovers();
    const interval = setInterval(fetchTopMovers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Top Movers – Last 3 Minutes</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-orange-400 border-b border-purple-700">
            <th className="py-2">Asset</th>
            <th className="py-2">Current Price</th>
            <th className="py-2">3m Ago</th>
            <th className="py-2">Gain %</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(({ symbol, current, previous, gain }) => (
            <tr key={symbol} className="border-b border-purple-900 hover:bg-purple-950">
              <td className="py-1 text-blue-300 font-semibold">{symbol}</td>
              <td className="py-1">${current.toFixed(2)}</td>
              <td className="py-1 text-gray-400">${previous.toFixed(2)}</td>
              <td className={`py-1 ${gain > 0 ? 'text-green-400' : 'text-red-400'}`}>{gain.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}