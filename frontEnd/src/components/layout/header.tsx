import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Monitor, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Monitor className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ScreenTime</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/reports" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Reports
            </Link>
            <Link to="/settings" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Settings
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Profile
            </Link>

            {/* CONDITIONAL BUTTON */}
            {user ? (
              <Button variant="outline" onClick={handleLogout} className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button asChild variant="default">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-2 pb-3 space-y-1">
            <Link to="/dashboard" className="block px-3 py-2 text-base text-gray-700 hover:text-indigo-600">
              Dashboard
            </Link>
            <Link to="/reports" className="block px-3 py-2 text-base text-gray-700 hover:text-indigo-600">
              Reports
            </Link>
            <Link to="/settings" className="block px-3 py-2 text-base text-gray-700 hover:text-indigo-600">
              Settings
            </Link>
            <Link to="/profile" className="block px-3 py-2 text-base text-gray-700 hover:text-indigo-600">
              Profile
            </Link>
            <Link to="/limits" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
  Limits
</Link>


            {/* Mobile conditional login/logout */}
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-base text-indigo-600 hover:bg-indigo-100">
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
