import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GainersTable() {
  const [coins, setCoins] = useState([]);
  const [prevCoins, setPrevCoins] = useState([]);
  const [countdown, setCountdown] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flashedItems, setFlashedItems] = useState({});
  
  const fetchTopMovers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:8001/top-gainers');
      // Store previous coins for comparison
      setPrevCoins(coins);
      setCoins(res.data);
      
      // Identify changed values
      const newFlashed = {};
      res.data.forEach(coin => {
        const prevCoin = coins.find(c => c.symbol === coin.symbol);
        if (prevCoin) {
          if (prevCoin.current !== coin.current) {
            newFlashed[`${coin.symbol}-current`] = true;
          }
          if (prevCoin.gain !== coin.gain) {
            newFlashed[`${coin.symbol}-gain`] = true;
          }
        }
      });
      
      setFlashedItems(newFlashed);
      
      // Clear flashing effect after 2 seconds
      setTimeout(() => {
        setFlashedItems({});
      }, 2000);
      
      setCountdown(30);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch 3min gainers', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopMovers();
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          return 30;
        }
        return prevCount - 1;
      });
    }, 1000);
    
    // Fetch new data every 30 seconds
    const fetchInterval = setInterval(fetchTopMovers, 30000);
    
    return () => {
      clearInterval(countdownInterval);
      clearInterval(fetchInterval);
    };
  }, []);

  // Format countdown into minutes and seconds
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="p-6 bg-gray-800/50 shadow-lg backdrop-blur-sm rounded-xl h-full border border-gray-700/30">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Top Gainers</h2>
        <div className="px-4 py-2 rounded-lg bg-green-900/30">
          <span className="text-sm text-green-300">UPDATES IN</span>
          <div className="flex mt-1 space-x-3">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-lg bg-green-900/50">0</div>
              <span className="mt-1 text-xs text-gray-400">Hour</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-lg bg-green-900/50">{minutes}</div>
              <span className="mt-1 text-xs text-gray-400">Min</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-lg bg-green-900/50">{seconds < 10 ? `0${seconds}` : seconds}</div>
              <span className="mt-1 text-xs text-gray-400">Sec</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-4">
        {lastUpdated && (
          <div className="flex items-center justify-center text-xs text-gray-400 mb-2">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            {isLoading && (
              <svg className="w-4 h-4 ml-2 text-green-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
        )}
        <button 
          onClick={fetchTopMovers} 
          className="px-3 py-1 text-xs text-white transition-colors bg-green-700 rounded-md hover:bg-green-600 focus:outline-none mb-4"
          disabled={isLoading}
        >
          Refresh Now
        </button>
      </div>
      <table className="w-full text-center table-fixed"> {/* Added table-fixed for more control over column widths */}
        <thead className="mb-4 text-xs tracking-wider text-gray-400 uppercase border-b border-gray-800">
          <tr>
            <th className="w-16 py-3 text-center">#</th> {/* Increased width for # column */}
            <th className="w-1/4 px-2 py-3 text-center">Asset</th> {/* Adjusted width for Asset column */}
            <th className="w-1/4 px-2 py-3 text-center">Current</th> {/* Adjusted width for Current column */}
            <th className="w-1/4 px-2 py-3 text-center">3m Ago</th> {/* Adjusted width for 3m Ago column */}
            <th className="w-1/4 px-2 py-3 text-center">Gain %</th> {/* Adjusted width for Gain % column */}
          </tr>
        </thead>
        <tbody>
          {coins.map(({ symbol, current, previous, gain }, idx) => (
            <tr 
              key={symbol}
              className={`border-b border-gray-800 hover:bg-gray-800/30 ${idx % 2 === 0 ? 'bg-gray-800/20' : ''} whitespace-nowrap`}> {/* Added whitespace-nowrap to prevent text wrapping */}
              <td className="w-16 py-4 text-center font-medium text-gray-300">{idx + 1}</td>
              <td className="px-2 py-4"> {/* Adjusted padding */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center w-8 h-8 mr-3 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <img
                      src={`https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/32`}
                      alt={`${symbol} icon`}
                      className="w-6 h-6"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = symbol.charAt(0);
                      }}
                    />
                  </div>
                  <span className="font-semibold text-white">{symbol}</span>
                </div>
              </td>
              <td className={`py-4 px-2 text-center font-mono ${flashedItems[`${symbol}-current`] ? 'bg-blue-900/40 rounded transition-colors' : 'text-white'}`}> {/* Adjusted padding */}
                ${current}
              </td>
              <td className="py-4 px-2 text-center font-mono text-gray-400">${previous}</td> {/* Adjusted padding */}
              <td className={`py-4 px-2 text-center font-mono ${flashedItems[`${symbol}-gain`] ? 'bg-green-900/40 rounded transition-colors' : 'text-green-400'}`}> {/* Adjusted padding */}
                +{gain}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}