import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Trash2, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import { getWhatsAppUrl } from '../../lib/constants';

export const AdminEnquiries: React.FC = () => {
  const { getToken } = useAdminAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'quotes' | 'messages'>('quotes');
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const token = getToken();
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const [qRes, mRes] = await Promise.all([
        fetch('/api/quotes', { headers }),
        fetch('/api/contact', { headers }),
      ]);

      const qData = qRes.ok ? await qRes.json() : [];
      const mData = mRes.ok ? await mRes.json() : [];

      setQuotes(qData || []);
      setMessages(mData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  const updateQuoteStatus = async (id: number, status: string) => {
    const token = getToken();
    try {
      const res = await fetch('/api/quotes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuote = async (id: number) => {
    if (!window.confirm('Delete this quote record?')) return;
    const token = getToken();
    try {
      const res = await fetch('/api/quotes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setQuotes(prev => prev.filter(q => q.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm('Delete this contact message?')) return;
    const token = getToken();
    try {
      const res = await fetch('/api/contact', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enquiries &amp; Quotes</h2>
          <p className="text-xs text-slate-500 mt-1">Review, follow up, and update statuses for quote requests and contact messages.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 text-xs font-bold transition border-b-2 ${
              activeTab === 'quotes'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Quote Requests ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 text-xs font-bold transition border-b-2 ${
              activeTab === 'messages'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Contact Messages ({messages.length})
          </button>
        </div>

        {activeTab === 'quotes' ? (
          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading quotes...</div>
            ) : quotes.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No quote requests found.
              </div>
            ) : (
              quotes.map((q) => (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{q.full_name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-red-600" /> {q.phone}</span>
                        {q.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {q.email}</span>}
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {q.created_at ? new Date(q.created_at).toLocaleString() : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={q.status || 'pending'}
                        onChange={(e) => updateQuoteStatus(q.id, e.target.value)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 bg-slate-50 text-slate-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>

                      <a
                        href={getWhatsAppUrl(`Hello ${q.full_name}, regarding your quote inquiry for ${q.service}...`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => deleteQuote(q.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs text-slate-700">
                    <div><span className="text-slate-400 block">Service:</span> <strong>{q.service}</strong></div>
                    <div><span className="text-slate-400 block">Project Type:</span> <strong>{q.project_type}</strong></div>
                    <div><span className="text-slate-400 block">Size Estimate:</span> <strong>{q.size_estimate}</strong></div>
                    <div><span className="text-slate-400 block">Paint Preference:</span> <strong>{q.paint_preference || 'None specified'}</strong></div>
                  </div>

                  {q.description && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                      <span className="font-semibold block text-slate-500 mb-0.5">Notes:</span>
                      {q.description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No contact messages found.
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{m.name} ({m.subject})</h4>
                      <p className="text-xs text-slate-500">{m.phone} {m.email ? `• ${m.email}` : ''}</p>
                    </div>
                    <button
                      onClick={() => deleteMessage(m.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-wrap">{m.message}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
