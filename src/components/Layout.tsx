
import React from 'react';
import { DashboardNav } from './DashboardNav';
import { MobileNav } from './MobileNav';
import { useAuthContext } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { BioLinkBlock } from './BioLinkBlock';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <BioLinkBlock />
      <div className="flex flex-1">
        <DashboardNav />
        <div className="flex-1">
          <MobileNav />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
