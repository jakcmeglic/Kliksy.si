import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { format, subDays, isAfter, startOfDay, isSameDay } from 'date-fns';
import { sl } from 'date-fns/locale';
import { QrCode, Package, CreditCard, Users, Calendar, ArrowLeft, LogOut, Download } from 'lucide-react';
import QRModal from '../components/QRModal';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'kliksyadmin2026'; // Simple hardcoded password for now

interface EventData {
  id: string;
  eventName: string;
  eventType: string;
  date: string;
  email: string;
  plan: 'basic' | 'standard' | 'premium';
  deliveryMode: 'self_print' | 'home_delivery';
  standsQuantity: number;
  printedQrQuantity: number;
  paymentStatus: string;
  createdAt: any;
  ownerId: string;
  selectedDesignId?: string;
  // Company info
  isCompanyInvoice?: boolean;
  companyName?: string;
  companyAddress?: string;
  companyTaxId?: string;
}

const PLAN_PRICES = {
  basic: 39,
  standard: 79,
  premium: 149
};

const getUpsellPrice = (stands: number, printed: number) => {
  let price = 0;
  if (stands > 0) price += stands * 15.99;
  if (printed === 5) price += 19.99;
  else if (printed === 10) price += 29.99;
  else if (printed === 20) price += 39.99;
  else if (printed === 30) price += 49.99;
  return price;
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'today' | 'yesterday' | 'l7d' | 'l30d' | 'lifetime'>('l30d');
  
  const [selectedEventForQR, setSelectedEventForQR] = useState<EventData | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchEvents();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      fetchEvents();
    } else {
      setError('Napačno uporabniško ime ali geslo.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EventData[];
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const yesterday = subDays(today, 1);
    const l7d = subDays(today, 7);
    const l30d = subDays(today, 30);

    return events.filter(event => {
      if (!event.createdAt) return false;
      const eventDate = event.createdAt.toDate();
      
      switch (timeframe) {
        case 'today': return isSameDay(eventDate, today);
        case 'yesterday': return isSameDay(eventDate, yesterday);
        case 'l7d': return isAfter(eventDate, l7d);
        case 'l30d': return isAfter(eventDate, l30d);
        case 'lifetime': return true;
        default: return true;
      }
    });
  }, [events, timeframe]);

  const stats = useMemo(() => {
    let totalEventsRevenue = 0;
    let totalUpsellsRevenue = 0;
    let totalOrders = filteredEvents.length;
    let paidOrders = 0;

    filteredEvents.forEach(event => {
      if (event.paymentStatus === 'paid') {
        paidOrders++;
        const basePrice = PLAN_PRICES[event.plan] || 0;
        const upsellPrice = getUpsellPrice(event.standsQuantity || 0, event.printedQrQuantity || 0);
        
        totalEventsRevenue += basePrice;
        totalUpsellsRevenue += upsellPrice;
      }
    });

    return {
      totalEventsRevenue,
      totalUpsellsRevenue,
      totalRevenue: totalEventsRevenue + totalUpsellsRevenue,
      totalOrders,
      paidOrders
    };
  }, [filteredEvents]);

  const chartData = useMemo(() => {
    const dataMap = new Map<string, { date: string; eventsRevenue: number; upsellsRevenue: number }>();
    
    // Initialize dates based on timeframe
    const now = new Date();
    let daysToShow = 30;
    if (timeframe === 'l7d') daysToShow = 7;
    if (timeframe === 'today') daysToShow = 1;
    if (timeframe === 'yesterday') daysToShow = 2; // Show yesterday and today for context
    
    if (timeframe !== 'lifetime') {
      for (let i = daysToShow - 1; i >= 0; i--) {
        const d = subDays(now, i);
        const dateStr = format(d, 'dd. MM.');
        dataMap.set(dateStr, { date: dateStr, eventsRevenue: 0, upsellsRevenue: 0 });
      }
    }

    filteredEvents.forEach(event => {
      if (event.paymentStatus === 'paid' && event.createdAt) {
        const dateStr = format(event.createdAt.toDate(), 'dd. MM.');
        const basePrice = PLAN_PRICES[event.plan] || 0;
        const upsellPrice = getUpsellPrice(event.standsQuantity || 0, event.printedQrQuantity || 0);
        
        if (dataMap.has(dateStr)) {
          const existing = dataMap.get(dateStr)!;
          existing.eventsRevenue += basePrice;
          existing.upsellsRevenue += upsellPrice;
        } else if (timeframe === 'lifetime') {
          dataMap.set(dateStr, { date: dateStr, eventsRevenue: basePrice, upsellsRevenue: upsellPrice });
        }
      }
    });

    return Array.from(dataMap.values()).reverse(); // Reverse if lifetime to show oldest first, or keep chronological
  }, [filteredEvents, timeframe]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Prijava</h1>
            <p className="text-gray-500 mt-2">Dostop samo za pooblaščene osebe</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uporabniško ime</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Geslo</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors mt-4"
            >
              Prijava
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Kliksy Admin</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Odjava</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Timeframe selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'today', label: 'Danes' },
            { id: 'yesterday', label: 'Včeraj' },
            { id: 'l7d', label: 'Zadnjih 7 dni' },
            { id: 'l30d', label: 'Zadnjih 30 dni' },
            { id: 'lifetime', label: 'Celotno obdobje' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                timeframe === t.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <CreditCard className="w-5 h-5" />
              <h3 className="font-medium">Skupni prihodki</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-indigo-500 mb-2">
              <Calendar className="w-5 h-5" />
              <h3 className="font-medium">Prihodki (Paketi)</h3>
            </div>
            <p className="text-3xl font-bold text-indigo-600">€{stats.totalEventsRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-500 mb-2">
              <Package className="w-5 h-5" />
              <h3 className="font-medium">Prihodki (Dodatki)</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-600">€{stats.totalUpsellsRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <Users className="w-5 h-5" />
              <h3 className="font-medium">Plačana naročila</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.paidOrders} <span className="text-sm text-gray-400 font-normal">/ {stats.totalOrders}</span></p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Prodaja po dnevih</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeframe === 'lifetime' ? chartData : chartData.reverse()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `€${value}`} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`€${value.toFixed(2)}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="eventsRevenue" name="Paketi dogodkov" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
                <Bar dataKey="upsellsRevenue" name="Dodatne storitve (Print, Stojala)" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Vsa naročila</h3>
            {loading && <span className="text-sm text-gray-500">Nalaganje...</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Datum</th>
                  <th className="px-6 py-4 font-medium">Dogodek</th>
                  <th className="px-6 py-4 font-medium">Stranka</th>
                  <th className="px-6 py-4 font-medium">Paket</th>
                  <th className="px-6 py-4 font-medium">Dodatki</th>
                  <th className="px-6 py-4 font-medium">Znesek</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => {
                  const basePrice = PLAN_PRICES[event.plan] || 0;
                  const upsellPrice = getUpsellPrice(event.standsQuantity || 0, event.printedQrQuantity || 0);
                  const total = basePrice + upsellPrice;
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {event.createdAt ? format(event.createdAt.toDate(), 'dd. MM. yyyy HH:mm') : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{event.eventName}</div>
                        <div className="text-gray-500 text-xs">{event.eventType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{event.email}</div>
                        {event.isCompanyInvoice && (
                          <div className="text-xs text-indigo-600 font-medium mt-1">Podjetje: {event.companyName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase">
                          {event.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {event.deliveryMode === 'home_delivery' ? (
                          <div className="flex flex-col gap-1">
                            {event.printedQrQuantity > 0 && <span>{event.printedQrQuantity}x Print QR</span>}
                            {event.standsQuantity > 0 && <span>{event.standsQuantity}x Stojalo</span>}
                          </div>
                        ) : (
                          <span className="text-gray-400">Brez dodatkov</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        €{total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {event.paymentStatus === 'paid' ? 'Plačano' : 'V čakanju'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedEventForQR(event)}
                          className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-medium transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                          QR Koda
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {events.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Ni najdenih naročil.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* QR Modal for Admin */}
      {selectedEventForQR && (
        <QRModal 
          isOpen={!!selectedEventForQR}
          onClose={() => setSelectedEventForQR(null)}
          event={selectedEventForQR}
          eventUrl={`${window.location.origin}/event/${selectedEventForQR.id}`}
          initialDesignId={selectedEventForQR.selectedDesignId}
        />
      )}
    </div>
  );
}
