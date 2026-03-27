import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Download, Image as ImageIcon, Users, Clock, Settings, ExternalLink, LogOut, Heart, Loader2, ArrowLeft } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useAuth } from "../components/AuthProvider";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, getDocs, onSnapshot, doc, getDoc, orderBy } from "firebase/firestore";
import QRModal from "../components/QRModal";

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlEventId = searchParams.get('eventId');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'settings'>('overview');
  const [event, setEvent] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.isAnonymous) {
      navigate('/login');
      return;
    }

    const fetchEvent = async () => {
      try {
        let eventDoc = null;
        if (urlEventId) {
          const docRef = doc(db, "events", urlEventId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().ownerId === user.uid) {
            eventDoc = { id: docSnap.id, ...docSnap.data() };
          }
        }

        if (!eventDoc) {
          const q = query(collection(db, "events"), where("ownerId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            eventDoc = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
          }
        }

        if (eventDoc) {
          setEvent(eventDoc);
        } else {
          setLoading(false);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "events");
      }
    };

    fetchEvent();
  }, [user, authLoading, urlEventId, navigate]);

  useEffect(() => {
    if (!event) return;

    const q = query(
      collection(db, "events", event.id, "photos"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(newPhotos);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `events/${event.id}/photos`);
    });

    return () => unsubscribe();
  }, [event]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-wedding-beige)]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-wedding-gold)]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-wedding-beige)] p-6 text-center">
        <h2 className="text-3xl font-serif mb-4">Nimate še dogodka</h2>
        <p className="text-gray-600 mb-8">Ustvarite svoj prvi dogodek za začetek zbiranja spominov.</p>
        <Link to="/create" className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors">
          Ustvari dogodek
        </Link>
      </div>
    );
  }

  // Ensure the QR code uses the correct URL format for BrowserRouter
  const baseUrl = window.location.origin;
  const eventUrl = `${baseUrl}/event/${event.id}`;
  
  const stats = [
    { label: "Naložene slike", value: photos.length.toString(), icon: ImageIcon },
    { label: "Gostje", value: new Set(photos.map(p => p.deviceId).filter(Boolean)).size.toString() || "0", icon: Users },
    { label: "Zadnja slika", value: photos.length > 0 ? "Pravkar" : "-", icon: Clock },
  ];

  const handleDownloadSingle = (url: string, index: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kliksy-${event.partner1}-${event.partner2}-${index + 1}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder(`Kliksy-${event.partner1}-${event.partner2}`);
      
      if (!folder) throw new Error("Could not create zip folder");

      // Fetch all images and add them to the zip
      const promises = photos.map(async (photo, index) => {
        try {
          const response = await fetch(photo.url);
          const blob = await response.blob();
          
          // Try to get original extension or default to jpg
          let extension = 'jpg';
          if (blob.type) {
            extension = blob.type.split('/')[1] || 'jpg';
          }
          
          folder.file(`photo-${index + 1}.${extension}`, blob);
        } catch (err) {
          console.error(`Failed to download photo ${index}`, err);
        }
      });

      await Promise.all(promises);
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Kliksy-${event.partner1}-${event.partner2}.zip`);
      setDownloadError('');
    } catch (error) {
      console.error("Error creating zip file:", error);
      setDownloadError("Prišlo je do napake pri prenosu. Poskusite znova.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-wedding-beige)] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[var(--color-wedding-sand)]/30 flex flex-col">
        <div className="p-6 border-b border-[var(--color-wedding-sand)]/30">
          <Link to="/" className="font-serif text-2xl tracking-tight text-[var(--color-wedding-dark)]">
            Kliksy<span className="text-[var(--color-wedding-gold)]">.</span>
          </Link>
        </div>
        
        <div className="p-6 flex-1">
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Tvoj dogodek</p>
            <h2 className="font-serif text-xl text-[var(--color-wedding-dark)] truncate">{event.partner1} & {event.partner2}</h2>
            <p className="text-sm text-[var(--color-wedding-text)]/60">{new Date(event.date).toLocaleDateString('sl-SI')}</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Pregled', icon: Clock },
              { id: 'gallery', label: 'Galerija', icon: ImageIcon },
              { id: 'settings', label: 'Nastavitve', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[var(--color-wedding-dark)] text-white' 
                    : 'text-[var(--color-wedding-text)] hover:bg-[var(--color-wedding-sand)]/20'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-[var(--color-wedding-sand)]/30">
          <button onClick={signOut} className="flex items-center gap-3 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
            <LogOut className="w-5 h-5" />
            Odjava
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Actions */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-[var(--color-wedding-sand)]"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--color-wedding-dark)]" />
              </button>
              <div>
                <h1 className="text-3xl font-serif text-[var(--color-wedding-dark)] mb-2">
                  {activeTab === 'overview' && 'Pregled dogodka'}
                  {activeTab === 'gallery' && 'Vse fotografije'}
                  {activeTab === 'settings' && 'Nastavitve'}
                </h1>
                <p className="text-[var(--color-wedding-text)]/70">Upravljaj svoje poročne spomine.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href={eventUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-wedding-sand)] rounded-full text-sm font-medium hover:bg-[var(--color-wedding-sand)]/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Poglej kot gost
              </a>
              <button 
                onClick={handleDownloadAll}
                disabled={isDownloading || photos.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-wedding-dark)] text-white rounded-full text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isDownloading ? "Pripravljam ZIP..." : "Prenesi vse (ZIP)"}
              </button>
            </div>
          </header>

          {downloadError && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
              {downloadError}
            </div>
          )}

          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-[var(--color-wedding-sand)]/30 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--color-wedding-beige)] rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-[var(--color-wedding-gold)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-wedding-text)]/60 mb-1">{stat.label}</p>
                      <p className="text-2xl font-serif text-[var(--color-wedding-dark)]">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* QR Code Card */}
                <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-[var(--color-wedding-sand)]/30 shadow-sm text-center flex flex-col items-center">
                  <h3 className="font-serif text-xl mb-2">Tvoja QR koda</h3>
                  <p className="text-sm text-[var(--color-wedding-text)]/60 mb-8">Natisni to kodo in jo postavi na mize.</p>
                  
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <QRCodeSVG 
                      value={eventUrl} 
                      size={180}
                      bgColor={"#ffffff"}
                      fgColor={"#2A2A2A"}
                      level={"Q"}
                      includeMargin={false}
                    />
                  </div>
                  
                  <button 
                    onClick={() => setIsQRModalOpen(true)}
                    className="w-full py-3 px-4 bg-[var(--color-wedding-beige)] text-[var(--color-wedding-dark)] rounded-xl text-sm font-medium hover:bg-[var(--color-wedding-sand)]/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Prenesi QR kodo
                  </button>
                </div>

                {/* Recent Photos Preview */}
                <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-[var(--color-wedding-sand)]/30 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-xl">Zadnje naloženo</h3>
                    <button onClick={() => setActiveTab('gallery')} className="text-sm font-medium text-[var(--color-wedding-gold)] hover:text-[var(--color-wedding-dark)] transition-colors">
                      Poglej vse
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos.slice(0, 6).map((photo, i) => (
                      <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group relative">
                        <img src={photo.url} alt="Wedding moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button onClick={() => handleDownloadSingle(photo.url, i)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Download className="w-5 h-5 text-[var(--color-wedding-dark)]" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {photos.length === 0 && (
                      <div className="col-span-full py-12 text-center text-gray-500">
                        Še ni naloženih fotografij.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group relative">
                    <img src={photo.url} alt="Wedding moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button onClick={() => handleDownloadSingle(photo.url, i)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Download className="w-5 h-5 text-[var(--color-wedding-dark)]" />
                      </button>
                    </div>
                  </div>
                ))}
                {photos.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-500">
                    Še ni naloženih fotografij.
                  </div>
                )}
              </div>
              <div className="text-center pt-8">
                <button className="px-8 py-3 bg-white border border-[var(--color-wedding-sand)] rounded-full text-sm font-medium hover:bg-[var(--color-wedding-sand)]/20 transition-colors">
                  Naloži več
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-[var(--color-wedding-sand)]/30 shadow-sm max-w-2xl"
            >
              <h3 className="font-serif text-xl mb-6">Nastavitve dogodka</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ime dogodka</label>
                  <input 
                    type="text" 
                    defaultValue={`${event.partner1} & ${event.partner2}`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Datum</label>
                  <input 
                    type="date" 
                    defaultValue={event.date}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pozdravno sporočilo za goste</label>
                  <textarea 
                    defaultValue="Hvala, ker deliš spomine z nama."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all resize-none"
                  />
                </div>
                
                <div className="pt-6 border-t border-[var(--color-wedding-sand)]/30">
                  <button className="px-8 py-3 bg-[var(--color-wedding-dark)] text-white rounded-xl font-medium hover:bg-black transition-colors">
                    Shrani spremembe
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        event={event} 
        eventUrl={eventUrl} 
      />
    </div>
  );
}
