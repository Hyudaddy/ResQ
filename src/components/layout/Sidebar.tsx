import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';
import {
  Home,
  AlertTriangle,
  ListChecks,
  UserCircle,
  LogOut,
  Settings,
  Users,
  BarChart3,
  FileText,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import Button from '../common/Button';
import { ShieldAlert } from 'lucide-react';

interface NavItem {
  path: string;
  name: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navSections: NavSection[] = [
    {
      title: 'General',
      items: [
        {
          path: '/',
          name: 'Dashboard',
          icon: <Home size={20} />,
          roles: ['public', 'responder', 'admin'],
        },
        {
          path: '/incidents/report',
          name: 'Report Incident',
          icon: <AlertTriangle size={20} />,
          roles: ['public', 'responder', 'admin'],
        },
        {
          path: '/incidents',
          name: 'Incidents',
          icon: <ListChecks size={20} />,
          roles: ['public', 'responder', 'admin'],
        },
      ],
    },
    {
      title: 'Responder Tools',
      items: [
        {
          path: '/responder/alerts',
          name: 'Active Alerts',
          icon: <ShieldAlert size={20} />,
          roles: ['responder', 'admin'],
        },
        {
          path: '/responder/reports',
          name: 'Reports',
          icon: <FileText size={20} />,
          roles: ['responder', 'admin'],
        },
      ],
    },
    {
      title: 'Admin',
      items: [
        {
          path: '/admin/users',
          name: 'User Management',
          icon: <Users size={20} />,
          roles: ['admin'],
        },
        {
          path: '/admin/analytics',
          name: 'Analytics',
          icon: <BarChart3 size={20} />,
          roles: ['admin'],
        },
        {
          path: '/admin/settings',
          name: 'Settings',
          icon: <Settings size={20} />,
          roles: ['admin'],
        },
      ],
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!user) return null;

  const isLinkActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navigationItems = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(user.role)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-dark-800 text-dark-100 md:hidden"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-dark-900 text-dark-100 h-screen fixed top-0 left-0 z-40 transition-all duration-300 transform shadow-xl
          ${collapsed ? 'w-16' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center">
              <div className="bg-primary-500 text-white h-8 w-8 rounded-md flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              {!collapsed && <h1 className="ml-2 text-xl font-bold text-primary-500">ResQ</h1>}
            </div>
            {!collapsed && (
              <button
                className="p-1 rounded-md hover:bg-dark-800 text-dark-300 hidden md:block"
                onClick={toggleSidebar}
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navigationItems.map((section, index) => (
              <div key={index} className="mb-6">
                {!collapsed && (
                  <h2 className="px-4 mb-2 text-xs font-semibold text-dark-400 uppercase tracking-wider">
                    {section.title}
                  </h2>
                )}
                <ul>
                  {section.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-150
                          ${
                            isLinkActive(item.path)
                              ? 'bg-primary-500/10 text-primary-500 border-l-2 border-primary-500'
                              : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800'
                          }
                          ${collapsed ? 'justify-center' : 'justify-start'}
                        `}
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className={`${collapsed ? '' : 'mr-3'}`}>{item.icon}</span>
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* User area */}
          <div className={`p-4 border-t border-dark-800 ${collapsed ? 'items-center' : ''}`}>
            {!collapsed && (
              <div className="flex items-center mb-3">
                <div className="bg-dark-700 text-dark-300 h-8 w-8 rounded-full flex items-center justify-center">
                  <UserCircle size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-dark-100 truncate max-w-[180px]">{user.name}</p>
                  <p className="text-xs text-dark-400 capitalize">{user.role}</p>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className={`${collapsed ? 'p-2 w-auto justify-center' : 'w-full'} border border-dark-700`}
              onClick={logout}
              leftIcon={collapsed ? undefined : <LogOut size={16} />}
            >
              {collapsed ? <LogOut size={16} /> : 'Logout'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;