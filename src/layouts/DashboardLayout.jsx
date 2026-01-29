import React, { useState } from 'react';
import SidebarAdmin from '../pages/DashboardAdmin/components/SidebarAdmin';
import HeaderAdmin from '../pages/DashboardAdmin/components/HeaderAdmin';
import FloatingActions from '../pages/DashboardAdmin/components/FloatingActions';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 lg:ml-64">
        <HeaderAdmin onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 sm:p-6 space-y-6">{children}</main>
      </div>
      <FloatingActions />
    </div>
  );
}

export default DashboardLayout;
