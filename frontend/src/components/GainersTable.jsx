import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';

export default function GainersTable() {
  const [coins, setCoins] = useState([]);

  const fetchTopMovers = async () => {
    try {
      const res = await axios.get('http://localhost:8001/top-gainers');
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
    <div className="max-w-4xl mx-auto my-8">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Top Movers – Last 3 Minutes</h2>
        <table className="w-full text-left divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-3 px-6">#</th>
              <th className="py-3 px-6">Asset</th>
              <th className="py-3 px-6">Current</th>
              <th className="py-3 px-6">3m Ago</th>
              <th className="py-3 px-6">Gain %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {coins.map(({ symbol, current, previous, gain }, idx) => (
              <tr
                key={symbol}
                className={`transition duration-200 transform hover:scale-105 hover:bg-gray-800 cursor-pointer ${idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}>
                <td className="py-2 px-4 font-medium text-white">{idx + 1}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    <img
                      src={`https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/32`}
                      alt={`${symbol} icon`}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-blue-300 font-semibold">{symbol}</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-white">${current.toFixed(2)}</td>
                <td className="py-2 px-4 text-gray-400">${previous.toFixed(2)}</td>
                <td className={`py-2 px-4 font-bold ${gain > 0 ? 'text-green-400' : 'text-red-400'}`}>{gain.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}