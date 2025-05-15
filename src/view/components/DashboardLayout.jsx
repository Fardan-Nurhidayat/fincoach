import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-y-auto bg-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;