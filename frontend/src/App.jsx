import React from 'react';
import GainersTable from './components/GainersTable';
import LosersTable from './components/LosersTable';

// Get current date in format MM/DD/YYYY
const today = new Date();
const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

export default function App() {
  return (
    <div className="min-h-screen px-5 py-6 text-white bg-gray-900">
      <div className="max-w-7xl pb-6 mx-auto"> {/* Changed max-w-5xl to max-w-7xl for wider layout */}
        <div className="p-1 text-xs tracking-wide text-center text-gray-500 uppercase">
          leaderboard
        </div>
        
        <div className="overflow-hidden rounded-xl bg-gray-800/80 backdrop-blur-md">
          <div className="p-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <h1 className="text-2xl font-medium text-center text-white">
              Top 10 gains and losses {formattedDate}
            </h1>
          </div>
          
          <div className="flex flex-col p-8 md:flex-row">
            <div className="w-full md:w-1/2 md:pr-4">
              <GainersTable />
            </div>
            <div className="w-full mt-8 md:w-1/2 md:pl-4 md:mt-0">
              <LosersTable />
            </div>
          </div>
          
          <div className="px-8 py-4 border-t border-gray-700 flex justify-center">
            <button className="flex items-center text-sm font-medium text-gray-400 hover:text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}