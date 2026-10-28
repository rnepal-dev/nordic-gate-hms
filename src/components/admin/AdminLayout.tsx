import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { BreadcrumbItem } from './AdminBreadcrumbs';
import { ToastProvider } from '../ui/Toast';

export interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  breadcrumbs = [],
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F8F5EF] flex font-sans antialiased text-[#25303A]">
        {/* Sidebar */}
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            onOpenMobileSidebar={() => setMobileOpen(true)}
            breadcrumbs={breadcrumbs}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};
