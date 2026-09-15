import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
  Briefcase,
  Layers,
  ShoppingBag,
  Inbox,
  ArrowRight,
  FileCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { getToken } = useAdminAuth();
  const [stats, setStats] = useState({
    servicesCount: 0,
    projectsCount: 0,
    paintsCount: 0,
    quotesCount: 0,
    messagesCount: 0,
    pendingQuotes: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = getToken();
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const [srvRes, prjRes, pntRes, qtsRes, msgRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/projects'),
          fetch('/api/paints'),
          fetch('/api/quotes', { headers }),
          fetch('/api/contact', { headers }),
        ]);

        const services = srvRes.ok ? await srvRes.json() : [];
        const projects = prjRes.ok ? await prjRes.json() : [];
        const paints = pntRes.ok ? await pntRes.json() : [];
        const quotes = qtsRes.ok ? await qtsRes.json() : [];
        const messages = msgRes.ok ? await msgRes.json() : [];

        const pending = Array.isArray(quotes)
          ? quotes.filter((q: any) => q.status === 'pending').length
          : 0;

        setStats({
          servicesCount: Array.isArray(services) ? services.length : 0,
          projectsCount: Array.isArray(projects) ? projects.length : 0,
          paintsCount: Array.isArray(paints) ? paints.length : 0,
          quotesCount: Array.isArray(quotes) ? quotes.length : 0,
          messagesCount: Array.isArray(messages) ? messages.length : 0,
          pendingQuotes: pending,
        });

        if (Array.isArray(quotes)) {
          setRecentQuotes(quotes.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [getToken]);

  const cards = [
    {
      title: 'Active Services',
      value: stats.servicesCount,
      desc: 'Painting, POP & Solar',
      icon: Briefcase,
      color: 'bg-blue-600',
      link: '/admin/services',
    },
    {
      title: 'Project Portfolio',
      value: stats.projectsCount,
      desc: 'Published showcase items',
      icon: Layers,
      color: 'bg-emerald-600',
      link: '/admin/projects',
    },
    {
      title: 'Paint Products',
      value: stats.paintsCount,
      desc: 'Classy Satin & formulations',
      icon: ShoppingBag,
      color: 'bg-red-600',
      link: '/admin/products',
    },
    {
      title: 'Quote Inquiries',
      value: stats.quotesCount,
      desc: `${stats.pendingQuotes} awaiting response`,
      icon: Inbox,
      color: 'bg-purple-600',
      link: '/admin/enquiries',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/30 text-red-400 text-xs font-bold rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zinux Administration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Administrator
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Manage website content, products, portfolio, quotes, and business settings.
            </p>
          </div>

          <Link
            to="/admin/enquiries"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow"
          >
            Review Quotes ({stats.pendingQuotes})
          </Link>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link
                key={i}
                to={c.link}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{c.title}</span>
                  <div className={`w-10 h-10 rounded-xl ${c.color} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-black text-slate-900">{loading ? '...' : c.value}</div>
                  <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-red-600 transition-colors">
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Quotes Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Quote Requests</h3>
              <p className="text-xs text-slate-500">Live submissions from the public website</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(n => <div key={n} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : recentQuotes.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No quote requests received yet.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Project Type</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{q.full_name}</td>
                      <td className="py-3 text-slate-600">{q.phone}</td>
                      <td className="py-3 text-slate-700 font-medium">{q.service}</td>
                      <td className="py-3 text-slate-500">{q.project_type}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          q.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {q.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {q.created_at ? new Date(q.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/content"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm flex items-center gap-4 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Edit Hero &amp; Copy</h4>
              <p className="text-xs text-slate-500">Update headlines and CTAs</p>
            </div>
          </Link>

          <Link
            to="/admin/media"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm flex items-center gap-4 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Upload Media</h4>
              <p className="text-xs text-slate-500">Add project and product photos</p>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm flex items-center gap-4 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Business Details</h4>
              <p className="text-xs text-slate-500">Update phone, WhatsApp, socials</p>
            </div>
          </Link>
        </div>

      </div>
    </AdminLayout>
  );
};
