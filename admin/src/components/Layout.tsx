import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-indigo-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">Feed2Dev</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    className={`text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/projects"
                    className={`text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium ${isActive('/projects')}`}
                  >
                    Projects
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <span className="text-white text-sm mr-4">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}