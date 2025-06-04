import React from 'react';
import TopBanner from './components/TopBanner';
import GainersTable from './components/GainersTable';

export default function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <TopBanner />
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-purple-400 text-2xl font-bold mb-4">Top Movers - Last 3 Minutes</h1>
        <GainersTable />
      </div>
    </div>
  );
}