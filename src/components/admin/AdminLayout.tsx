import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  ShoppingBag,
  Image,
  Inbox,
  Search,
  Scale,
  Settings,
  Palette,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Website Content', path: '/admin/content', icon: FileText },
    { label: 'Appearance & Theme', path: '/admin/appearance', icon: Palette },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Projects Showcase', path: '/admin/projects', icon: Layers },
    { label: 'Paint Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Media Library', path: '/admin/media', icon: Image },
    { label: 'Quotes & Enquiries', path: '/admin/enquiries', icon: Inbox },
    { label: 'SEO Metadata', path: '/admin/seo', icon: Search },
    { label: 'Legal Pages', path: '/admin/legal', icon: Scale },
    { label: 'Business Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
        
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm">
              Z
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Zinux Admin</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Management Console</p>
            </div>
          </Link>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Session" />
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User badge and logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {user?.email || 'Administrator'}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">Verified Administrator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold rounded-lg transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Site</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-950/50 hover:bg-red-900/60 text-red-300 hover:text-red-100 text-[11px] font-semibold rounded-lg border border-red-800/40 transition"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Zinux Paints &amp; Interior Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-slate-900 text-white p-4 border-b border-slate-800 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                    active ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Main Body with scroll */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};
