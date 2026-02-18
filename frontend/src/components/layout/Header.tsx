import { Link } from 'react-router-dom';
import { Film, Menu, X } from 'lucide-react';
import { Button } from '../ui';
import { useState } from 'react';

interface HeaderProps {
  isAuthenticated?: boolean;
  userRole?: 'creator' | 'buyer' | 'admin';
  onLogout?: () => void;
}

export function Header({ isAuthenticated = false, userRole, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-warm-gray-200 sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-cmc-navy hover:opacity-80 transition">
            <Film className="w-8 h-8 text-cmc-gold" />
            <span className="text-2xl font-bold">CMC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/library" className="text-cmc-navy hover:text-cmc-gold transition font-medium">
              Browse Library
            </Link>
            <Link to="/pricing" className="text-cmc-navy hover:text-cmc-gold transition font-medium">
              Plans
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-cmc-navy hover:text-cmc-gold transition font-medium">
                  Dashboard
                </Link>
                {userRole === 'creator' && (
                  <Link to="/submit" className="text-cmc-navy hover:text-cmc-gold transition font-medium">
                    Submit Project
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-cmc-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-warm-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                to="/library"
                className="text-cmc-navy hover:text-cmc-gold transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Library
              </Link>
              <Link
                to="/pricing"
                className="text-cmc-navy hover:text-cmc-gold transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Plans
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-cmc-navy hover:text-cmc-gold transition font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {userRole === 'creator' && (
                    <Link
                      to="/submit"
                      className="text-cmc-navy hover:text-cmc-gold transition font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Submit Project
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
