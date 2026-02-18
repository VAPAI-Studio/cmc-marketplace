import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  userRole?: 'creator' | 'buyer' | 'admin';
  onLogout?: () => void;
}

export function Layout({ children, isAuthenticated, userRole, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
