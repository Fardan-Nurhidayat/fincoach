import React from 'react';
import { Input } from './ui/input'; // Assuming shadcn Input component

const DashboardHeader = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;