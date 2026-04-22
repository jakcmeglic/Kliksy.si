import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs, query, orderBy, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { format, subDays, isAfter, startOfDay, isSameDay } from 'date-fns';
import { sl } from 'date-fns/locale';
import { QrCode, Package, CreditCard, Users, Calendar, ArrowLeft, LogOut, Download } from 'lucide-react';
import QRModal from '../components/QRModal';

class QRErrorBoundary extends React.Component<{children: React.ReactNode, onClose: () => void}, {hasError: boolean, errorText: string}> {
  state = { hasError: false, errorText: '' };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorText: error.toString() + "\n" + (error.stack || '') };
  }

  render() {
    if (this.state.hasError) {
       return (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80">
           <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-red-600 font-bold text-xl mb-4">Error loading QR Modal</h2>
              <pre className="text-[10px] bg-red-50 p-4 rounded whitespace-pre-wrap font-mono text-red-900 border border-red-200" style={{maxHeight: '60vh', overflowY: 'auto'}}>
                {this.state.errorText}
              </pre>
              <div className="mt-6">
                <button className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg" onClick={this.props.onClose}>Close & Return</button>
              </div>
           </div>
         </div>
       );
    }
    return this.props.children;
  }
}

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'kliksyadmin2026'; // Simple hardcoded password for now

interface EventData {
  id: string;
  eventName: string;
  eventType: string;
  partner1?: string;
  partner2?: string;
  date: string;
  email: string;
  plan: 'basic' | 'plus' | 'premium';
  deliveryMode: 'self_print' | 'home_delivery';
  standsQuantity: number;
  printedQrQuantity: number;
  paymentStatus: string;
  amountPaid?: number;
  discountCode?: string;
  createdAt: any;
  ownerId: string;
  selectedDesignId?: string;
  // Delivery info
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryPostcode?: string;
  selectedStand?: string;
  // Company info
  isCompanyInvoice?: boolean;
  companyName?: string;
  companyAddress?: string;
  companyTaxId?: string;
}

const PLAN_PRICES = {
  basic: 39,
  plus: 49,
  premium: 79
};

const getUpsellPrice = (stands: number, printed: number, deliveryMode: string = 'self_print') => {
  let price = 0;
  if (deliveryMode === 'home_delivery') {
    if (printed === 5) price += 19.99;
    else if (printed === 10) price += 29.99;
    else if (printed === 20) price += 39.99;
    else if (printed === 30) price += 49.99;
    else if (printed > 0) price += 19.99;

    if (stands === 5) price += 4.99;
    else if (stands === 10) price += 9.99;
    else if (stands === 20) price += 12.99;
    else if (stands === 30) price += 14.99;
  } else {
    if (stands === 5) price += 19.99;
    else if (stands === 10) price += 24.99;
    else if (stands === 20) price += 29.99;
    else if (stands === 30) price += 34.99;
  }
  return price;
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'promo'>('stats');
  
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discountType: 'percentage', // percentage or fixed
    value: 0,
    validUntil: '',
    appliesTo: 'all', // all or packages_only
    isActive: true
  });
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  
  const [timeframe, setTimeframe] = useState<'today' | 'yesterday' | 'l7d' | 'l30d' | 'lifetime'>('l30d');
  
  const [selectedEventForQR, setSelectedEventForQR] = useState<EventData | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [invoicePreview, setInvoicePreview] = useState<{event: EventData, total: number} | null>(null);
  
  const confirmCreateInvoice = async () => {
    if (!invoicePreview) return;
    try {
      setIsUpdating(true);
      const res = await fetch('/api/create-cebelca-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventData: invoicePreview.event, totalAmount: invoicePreview.total })
      });
      const data = await res.json();
      if (data.success) {
        alert("Račun je bil uspešno izdan!");
        setInvoicePreview(null);
      } else {
        alert("Napaka pri izdaji računa:\n" + data.message);
      }
    } catch (e: any) {
      alert("Napaka: " + e.message);
    } finally {
      setIsUpdating(false);
    }
  };

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
      
      // Fetch promo codes too
      const promoSnap = await getDocs(collection(db, 'promoCodes'));
      setPromoCodes(promoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code || newPromo.value <= 0) return;
    
    setIsUpdating(true);
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, 'promoCodes'), {
        ...newPromo,
        code: newPromo.code.toUpperCase(),
        createdAt: new Date().toISOString()
      });
      setPromoCodes([...promoCodes, { id: docRef.id, ...newPromo, code: newPromo.code.toUpperCase() }]);
      setNewPromo({
        code: '',
        discountType: 'percentage',
        value: 0,
        validUntil: '',
        appliesTo: 'all',
        isActive: true
      });
      setIsAddingPromo(false);
    } catch (err) {
      console.error("Error adding promo:", err);
      alert("Napaka pri dodajanju kode.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!window.confirm("Ali ste prepričani, da želite izbrisati to kodo?")) return;
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'promoCodes', id));
      setPromoCodes(promoCodes.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting promo:", err);
      alert("Napaka pri brisanju.");
    }
  };

  const handleTogglePromo = async (promo: any) => {
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'promoCodes', promo.id), {
        isActive: !promo.isActive
      });
      setPromoCodes(promoCodes.map(p => p.id === promo.id ? { ...p, isActive: !p.isActive } : p));
    } catch (err) {
      console.error("Error toggling promo:", err);
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
      if (event.paymentStatus !== 'paid') return false;
      
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
      const isPaid = event.paymentStatus === 'paid';
      if (isPaid) {
        paidOrders++;
        
        let basePrice = 0;
        let upsellPrice = 0;
        
        if (event.amountPaid !== undefined) {
          // If amountPaid is explicitly set, use it.
          upsellPrice = getUpsellPrice(event.standsQuantity || 0, event.printedQrQuantity || 0, event.deliveryMode);
          basePrice = Math.max(0, event.amountPaid - upsellPrice);
        } else {
          // Legacy calculation for events without amountPaid
          if (event.discountCode) {
            basePrice = 0;
          } else {
            basePrice = PLAN_PRICES[event.plan] || 0;
          }
          upsellPrice = getUpsellPrice(event.standsQuantity || 0, event.printedQrQuantity || 0, event.deliveryMode);
        }
        
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
      const isPaid = event.paymentStatus === 'paid';
      if (isPaid && event.createdAt) {
        const dateStr = format(event.createdAt.toDate(), 'dd. MM.');
        
        let basePrice = 0;
        let upsellPrice = 0;
        
        if (event.amountPaid !== undefined) {
          upsellPrice = getUpsellPrice(event.standsQuantity || 0, event.printedQrQuantity || 0, event.deliveryMode);
          basePrice = Math.max(0, event.amountPaid - upsellPrice);
        } else {
          if (event.discountCode) {
            basePrice = 0;
          } else {
            basePrice = PLAN_PRICES[event.plan] || 0;
          }
          upsellPrice = getUpsellPrice(event.standsQuantity || 0, event.printedQrQuantity || 0, event.deliveryMode);
        }
        
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

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    setIsUpdating(true);
    try {
      const amount = parseFloat(editAmount);
      await updateDoc(doc(db, 'events', editingEvent.id), {
        paymentStatus: 'paid',
        amountPaid: isNaN(amount) ? 0 : amount
      });
      
      // Update local state
      setEvents(events.map(ev => 
        ev.id === editingEvent.id 
          ? { ...ev, paymentStatus: 'paid', amountPaid: isNaN(amount) ? 0 : amount } 
          : ev
      ));
      
      setEditingEvent(null);
      setEditAmount('');
    } catch (err) {
      console.error("Error updating payment:", err);
      alert("Napaka pri posodabljanju statusa.");
    } finally {
      setIsUpdating(false);
    }
  };

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
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {[
            { id: 'stats', label: 'Statistika', icon: BarChart },
            { id: 'orders', label: 'Naročila', icon: CreditCard },
            { id: 'promo', label: 'Promocijske kode', icon: LogOut }, // Using LogOut as placeholder icon for Tag/Promo
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 flex items-center gap-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <>
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
                  <BarChart data={timeframe === 'lifetime' ? chartData : [...chartData].reverse()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
          </>
        )}

        {activeTab === 'orders' && (
          /* Orders Table */
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
                {filteredEvents.map((event) => {
                  const basePrice = PLAN_PRICES[event.plan] || 0;
                  const upsellPrice = getUpsellPrice(event.standsQuantity || 0, event.printedQrQuantity || 0, event.deliveryMode);
                  const total = event.amountPaid !== undefined ? event.amountPaid : (basePrice + upsellPrice);
                  
                  return (
                    <React.Fragment key={event.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 border-b-0">
                          {event.createdAt ? format(event.createdAt.toDate(), 'dd. MM. yyyy HH:mm') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 border-b-0">
                          <div className="font-medium text-gray-900">{event.eventName}</div>
                          <div className="text-gray-500 text-xs">{event.eventType}</div>
                          {event.date && (
                            <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-1 border border-indigo-100">
                              Datum: {format(new Date(event.date), 'dd. MM. yyyy')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 border-b-0">
                          <div className="font-medium text-gray-900">{event.email}</div>
                          {event.isCompanyInvoice && (
                            <div className="text-xs text-indigo-600 font-medium mt-1">Podjetje: {event.companyName}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 border-b-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase">
                            {event.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 border-b-0">
                          {(event.deliveryMode === 'home_delivery' || event.standsQuantity > 0) ? (
                            <div className="flex flex-col gap-1">
                              {event.deliveryMode === 'home_delivery' && event.printedQrQuantity > 0 && <span>{event.printedQrQuantity}x Print QR</span>}
                              {event.standsQuantity > 0 && (
                                <div className="flex flex-col gap-1">
                                  <span>{event.standsQuantity}x Podstavek</span>
                                  {event.selectedStand && (
                                    <a href={event.selectedStand} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors inline-block mt-0.5">
                                      Poglej izbran dizajn &rarr;
                                    </a>
                                  )}
                                </div>
                              )}
                              
                              {(event.deliveryAddress) && (
                                <div className="text-xs mt-1 bg-gray-50 p-2 rounded border border-gray-100">
                                  <div className="font-medium text-gray-700 mb-0.5">Dostava:</div>
                                  <div className="text-gray-600 leading-tight">
                                    {event.deliveryAddress}<br />
                                    {event.deliveryPostcode} {event.deliveryCity}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">Brez dodatkov</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 border-b-0">
                          €{total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 border-b-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {event.paymentStatus === 'paid' ? 'Plačano' : 'V čakanju'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right border-b-0">
                          <div className="flex items-center justify-end gap-2">
                            {event.paymentStatus !== 'paid' && (
                              <button
                                onClick={() => {
                                  setEditingEvent(event);
                                  setEditAmount(total.toString());
                                }}
                                className="inline-flex items-center justify-center px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors"
                              >
                                Označi kot plačano
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedEventForQR(event)}
                              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-medium transition-colors"
                            >
                              <QrCode className="w-4 h-4" />
                              QR Koda
                            </button>
                            {event.paymentStatus === 'paid' && (
                              <button
                                onClick={() => setInvoicePreview({ event, total })}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#f5a623] bg-opacity-10 text-[#e08e0b] hover:bg-opacity-20 rounded-lg text-xs font-medium transition-colors"
                              >
                                Izdaj račun (Čebelca)
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {(event.deliveryMode === 'home_delivery' || event.isCompanyInvoice) && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={8} className="px-6 pb-4 pt-1 text-sm text-gray-600">
                            <div className="flex gap-x-8">
                              {event.deliveryMode === 'home_delivery' && (
                                <div>
                                  <strong className="text-gray-900">Dostava:</strong> {event.deliveryAddress}, {event.deliveryPostcode} {event.deliveryCity}
                                  {event.selectedDesignId && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium text-xs">Dizajn: {event.selectedDesignId}</span>}
                                </div>
                              )}
                              {event.isCompanyInvoice && (
                                <div>
                                  <strong className="text-gray-900">Podjetje:</strong> {event.companyName}, {event.companyAddress} (Davčna: {event.companyTaxId})
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
      )}
      {activeTab === 'promo' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Upravljanje promocijskih kod</h3>
                <p className="text-gray-500 mt-1">Ustvarite in spremljajte kode za popust.</p>
              </div>
              <button 
                onClick={() => setIsAddingPromo(!isAddingPromo)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                {isAddingPromo ? 'Prekliči' : 'Dodaj novo kodo'}
              </button>
            </div>

            {isAddingPromo && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-2xl"
              >
                <form onSubmit={handleAddPromo} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Koda (npr. POPUST20)</label>
                      <input 
                        type="text" 
                        value={newPromo.code}
                        onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="KODA123"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Popust</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={newPromo.value}
                          onChange={e => setNewPromo({...newPromo, value: parseFloat(e.target.value)})}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="20"
                          required
                        />
                        <select 
                          value={newPromo.discountType}
                          onChange={e => setNewPromo({...newPromo, discountType: e.target.value as any})}
                          className="w-24 px-2 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">€</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Velja do (neobvezno)</label>
                      <input 
                        type="date" 
                        value={newPromo.validUntil}
                        onChange={e => setNewPromo({...newPromo, validUntil: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Velja za</label>
                      <select 
                        value={newPromo.appliesTo}
                        onChange={e => setNewPromo({...newPromo, appliesTo: e.target.value as any})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">Vse (vključno z dodatki)</option>
                        <option value="packages_only">Samo pakete</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      disabled={isUpdating}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50"
                    >
                      {isUpdating ? 'Shranjujem...' : 'Shrani promocijsko kodo'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">Koda</th>
                      <th className="px-6 py-4 font-medium">Popust</th>
                      <th className="px-6 py-4 font-medium">Velja za</th>
                      <th className="px-6 py-4 font-medium">Veljavnost</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Akcije</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {promoCodes.map((promo) => (
                      <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{promo.code}</td>
                        <td className="px-6 py-4">
                          {promo.value}{promo.discountType === 'percentage' ? '%' : '€'}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {promo.appliesTo === 'all' ? 'Vse' : 'Samo pakete'}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {promo.validUntil ? format(new Date(promo.validUntil), 'dd. MM. yyyy') : 'Neomejeno'}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleTogglePromo(promo)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              promo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {promo.isActive ? 'Aktivna' : 'Onemogočena'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeletePromo(promo.id)}
                            className="text-red-500 hover:text-red-700 font-medium px-2 py-1"
                          >
                            Izbriši
                          </button>
                        </td>
                      </tr>
                    ))}
                    {promoCodes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          Ni aktivnih promocijskih kod.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Modal for Admin */}
      {selectedEventForQR && (
        <QRErrorBoundary onClose={() => setSelectedEventForQR(null)}>
          <QRModal 
            isOpen={!!selectedEventForQR}
            onClose={() => setSelectedEventForQR(null)}
            event={selectedEventForQR}
            eventUrl={`${window.location.origin}/event/${selectedEventForQR.id}`}
            initialDesignId={selectedEventForQR.selectedDesignId}
          />
        </QRErrorBoundary>
      )}
      {/* Edit Payment Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Označi kot plačano</h3>
              <p className="text-sm text-gray-500 mt-1">Dogodek: {editingEvent.eventName}</p>
            </div>
            <form onSubmit={handleUpdatePayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plačan znesek (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Vnesi 0, če je bil uporabljen 100% popust.</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Prekliči
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Shranjujem...' : 'Shrani'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {invoicePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">Predogled Računa (Čebelca)</h3>
              <p className="text-sm text-gray-500 mt-1">Preglejte podatke preden se račun uradno izda v sistem Čebelca.</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-6">
              {/* Partner Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Podatki o stranki</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-500 mb-1">Ime / Naziv:</span>
                    <span className="font-medium text-gray-900">
                      {invoicePreview.event.isCompanyInvoice 
                        ? invoicePreview.event.companyName 
                        : (invoicePreview.event.deliveryName ? `${invoicePreview.event.deliveryName} ${invoicePreview.event.deliverySurname || ''}`.trim() : invoicePreview.event.email)}
                    </span>
                  </div>
                  {invoicePreview.event.isCompanyInvoice && (
                    <div>
                      <span className="block text-gray-500 mb-1">Davčna številka:</span>
                      <span className="font-medium text-gray-900">{invoicePreview.event.companyTaxId}</span>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="block text-gray-500 mb-1">Naslov:</span>
                    <span className="font-medium text-gray-900">
                      {invoicePreview.event.isCompanyInvoice 
                        ? invoicePreview.event.companyAddress 
                        : (invoicePreview.event.deliveryAddress ? `${invoicePreview.event.deliveryAddress}, ${invoicePreview.event.deliveryPostcode} ${invoicePreview.event.deliveryCity}`: "Ni naslova")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Postavke</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-900 font-medium">{`Paket ${invoicePreview.event.plan ? invoicePreview.event.plan.toUpperCase() : 'NEZNANO'}`}</span>
                    <span className="text-gray-900 font-bold">{invoicePreview.total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-gray-500">Skupaj za plačilo:</span>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f5a623] to-[#e08e0b]">
                      {invoicePreview.total.toFixed(2)} €
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex flex-col gap-1">
                  <span><strong>Način plačila:</strong> Kartica (prek spleta)</span>
                  <span><strong>Opomba:</strong> Račun je že v celoti plačan.</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white flex gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setInvoicePreview(null)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                disabled={isUpdating}
              >
                Prekliči
              </button>
              <button
                type="button"
                onClick={confirmCreateInvoice}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#f5a623] to-[#e08e0b] text-white rounded-xl font-medium shadow hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isUpdating ? 'Izdajam...' : 'Potrdi in izdaj račun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
