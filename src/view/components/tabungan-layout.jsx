import React from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function TabunganLayout({ children }) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-y-auto bg-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}