import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getPageTitle = () => {
    if (isActive('/dashboard')) return 'Dashboard';
    if (isActive('/request-leave')) return 'Request Leave';
    if (isActive('/admin-dashboard')) return 'Admin Dashboard';
    return 'HR Connect';
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="fixed h-full w-[280px] left-0 top-0 hidden lg:flex flex-col bg-surface-container-low border-r border-outline-variant shadow-sm z-50">
        <div className="flex flex-col h-full py-5">
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
            </div>
            <div>
              <h1 className="font-bold text-primary text-lg">Penthara</h1>
              <p className="text-xs text-on-surface-variant">Leave Management</p>
            </div>
          </div>

          <nav className="flex-1 px-2 space-y-1">
            <Link
              to="/dashboard"
              className={`rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors text-body-md ${isActive('/dashboard')
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>

            <Link
              to="/request-leave"
              className={`rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors text-body-md ${isActive('/request-leave')
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              <span className="material-symbols-outlined">event_available</span>
              Request Leave
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin-dashboard"
                className={`rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors text-body-md ${isActive('/admin-dashboard')
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
              >
                <span className="material-symbols-outlined">admin_panel_settings</span>
                Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="px-2 pt-4 border-t border-outline-variant space-y-1">
            <button
              onClick={handleLogout}
              className="w-[calc(100%-16px)] text-left text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors text-body-md cursor-pointer"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Top Header */}
      <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-280px)] h-16 z-40 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center px-6 h-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="font-bold text-primary text-lg">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-label-md font-semibold text-on-surface">{user?.name || 'User'}</p>
                <p className="text-xs text-on-surface-variant capitalize">{user?.role || 'Employee'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm border-2 border-primary-fixed shadow-sm">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="relative w-64 bg-surface-container-low h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
                </div>
                <span className="font-bold text-primary">HR Connect</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-1 space-y-2" onClick={() => setMobileMenuOpen(false)}>
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg ${isActive('/dashboard') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard
              </Link>
              <Link
                to="/request-leave"
                className={`flex items-center gap-3 p-3 rounded-lg ${isActive('/request-leave') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined">event_available</span>
                Request Leave
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin-dashboard"
                  className={`flex items-center gap-3 p-3 rounded-lg ${isActive('/admin-dashboard') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Admin Dashboard
                </Link>
              )}
            </nav>

            <div className="border-t border-outline-variant pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high text-left cursor-pointer"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="pt-16 pb-20 lg:pb-8 lg:pl-[280px]">
        <div className="max-w-7xl mx-auto p-4 md:p-6 w-full">
          {children}
        </div>
      </main>

      {/* Bottom navigation bar - Mobile */}
      <nav className="fixed bottom-0 w-full lg:hidden z-40 bg-surface border-t border-outline-variant shadow-lg">
        <div className="flex justify-around items-center h-16 w-full">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-4 ${isActive('/dashboard') ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-[11px] font-semibold mt-1">Home</span>
          </Link>
          <Link
            to="/request-leave"
            className={`flex flex-col items-center justify-center py-1 px-4 ${isActive('/request-leave') ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined">event_note</span>
            <span className="text-[11px] font-semibold mt-1">Leave</span>
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin-dashboard"
              className={`flex flex-col items-center justify-center py-1 px-4 ${isActive('/admin-dashboard') ? 'text-primary' : 'text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined">admin_panel_settings</span>
              <span className="text-[11px] font-semibold mt-1">Admin</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center py-1 px-4 text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-[11px] font-semibold mt-1">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
