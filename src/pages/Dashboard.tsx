import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Download, Image as ImageIcon, Users, Clock, Settings, ExternalLink, LogOut, Heart, Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useAuth } from "../components/AuthProvider";
import { db, storage, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, getDocs, onSnapshot, doc, getDoc, orderBy, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from 'firebase/storage';
import QRModal from "../components/QRModal";
import ImageViewer from "../components/ImageViewer";

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlEventId = searchParams.get('eventId');
  const isSuccess = searchParams.get('success') === 'true';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'settings'>('overview');
  const [event, setEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.isAnonymous) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        // Handle successful payment redirect
        if (isSuccess && urlEventId) {
          try {
            const eventDocRef = doc(db, "events", urlEventId);
            const eventSnap = await getDoc(eventDocRef);
            
            if (eventSnap.exists()) {
              const eventData = eventSnap.data();
              if (eventData.paymentStatus !== 'paid') {
                if (typeof window !== 'undefined' && window.fbq) {
                  window.fbq('track', 'Purchase', { currency: 'EUR', value: eventData.amountPaid || 0 });
                }
                await updateDoc(eventDocRef, { paymentStatus: 'paid' });
                
                // Trigger order summary email
                fetch('/api/send-order-summary', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: eventData.email || user.email,
                    eventName: eventData.eventName || (eventData.partner1 ? `${eventData.partner1} & ${eventData.partner2}` : 'Vaš dogodek'),
                    plan: eventData.plan,
                    amountPaid: eventData.amountPaid,
                    standsQuantity: eventData.standsQuantity,
                    printedQrQuantity: eventData.printedQrQuantity,
                    deliveryMode: eventData.deliveryMode
                  })
                }).catch(err => console.error("Failed to send order summary email:", err));
              }
            }

            // Clean up URL to prevent re-triggering on refresh
            navigate(`/dashboard?eventId=${urlEventId}`, { replace: true });
            return; // The navigate will re-trigger the useEffect without success=true
          } catch (err) {
            console.error("Error updating payment status:", err);
          }
        }

        const q = query(collection(db, "events"), where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          let allEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Filter out pending payments (keep paid, legacy events, or demo events)
          allEvents = allEvents.filter((e: any) => e.paymentStatus !== 'pending' || e.isDemo);
          
          // Sort events by createdAt descending in memory to avoid needing a composite index
          allEvents.sort((a: any, b: any) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });

          setEvents(allEvents);
          
          if (allEvents.length > 0) {
            let selectedEvent = allEvents[0];
            if (urlEventId) {
              const found = allEvents.find(e => e.id === urlEventId);
              if (found) {
                selectedEvent = found;
              }
            }
            setEvent(selectedEvent);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "events");
      }
    };

    fetchEvents();
  }, [user, authLoading, urlEventId, isSuccess, navigate]);

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

  const handleToggleLike = async (photoId: string) => {
    if (!event || !user?.uid) return;

    try {
      const photoRef = doc(db, "events", event.id, "photos", photoId);
      const photoSnap = await getDoc(photoRef);
      
      if (photoSnap.exists()) {
        const photoData = photoSnap.data();
        const likedBy = photoData.likedBy || [];
        const isLiked = likedBy.includes(user.uid);
        
        if (isLiked) {
          await updateDoc(photoRef, {
            likedBy: arrayRemove(user.uid),
            likes: Math.max(0, (photoData.likes || 1) - 1)
          });
        } else {
          await updateDoc(photoRef, {
            likedBy: arrayUnion(user.uid),
            likes: (photoData.likes || 0) + 1
          });
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB] p-6 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">Nimate še dogodka</h2>
        <p className="text-gray-600 mb-8">Ustvarite svoj prvi dogodek za začetek zbiranja spominov.</p>
        <Link to="/create" className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors shadow-sm">
          Ustvari dogodek
        </Link>
      </div>
    );
  }

  // Ensure the QR code uses the correct URL format for BrowserRouter
  const baseUrl = window.location.origin;
  const eventUrl = `${baseUrl}/event/${event.id}`;
  
  const handleDownloadRawQR = () => {
    const svg = document.getElementById("raw-qr-code-svg");
    if (!svg) return;
    try {
      let svgData = new XMLSerializer().serializeToString(svg);
      
      // Force higher dimensions for a crisp, high-quality PNG
      const size = 1024;
      if (svgData.includes('width=')) {
        svgData = svgData.replace(/width="[^"]+"/, `width="${size}"`);
      } else {
        svgData = svgData.replace('<svg ', `<svg width="${size}" `);
      }
      
      if (svgData.includes('height=')) {
        svgData = svgData.replace(/height="[^"]+"/, `height="${size}"`);
      } else {
        svgData = svgData.replace('<svg ', `<svg height="${size}" `);
      }

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      
      const img = new Image();
      img.onload = () => {
        if (!ctx) return;
        // White background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        canvas.toBlob((blob) => {
          if (!blob) return;
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          
          const eventNameStr = event.eventType === 'poroka' || !event.eventType ? `${event.partner1}-${event.partner2}` : event.eventName;
          link.download = `QR-Koda-${eventNameStr}.png`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, "image/png", 1.0);
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch (err) {
      console.error("Error downloading raw QR:", err);
    }
  };
  
  const stats = [
    { label: "Naložene slike", value: photos.length.toString(), icon: ImageIcon },
    { label: "Gostje", value: new Set(photos.map(p => p.deviceId).filter(Boolean)).size.toString() || "0", icon: Users },
    { label: "Zadnja slika", value: photos.length > 0 ? "Pravkar" : "-", icon: Clock },
  ];

  const handleDownloadSingle = async (url: string, index: number) => {
    try {
      let response;
      if (url.startsWith('data:')) {
        response = await fetch(url);
      } else {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
        response = await fetch(proxyUrl);
      }
      
      if (!response.ok && !url.startsWith('data:')) throw new Error("Proxy fetch failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      const eventNameStr = event.eventType === 'poroka' || !event.eventType ? `${event.partner1}-${event.partner2}` : event.eventName;
      
      let extension = 'jpg';
      if (blob.type) {
        extension = blob.type.split('/')[1] || 'jpg';
      }
      
      a.download = `Kliksy-${eventNameStr}-${index + 1}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Single download failed:", e);
      // Fallback
      window.open(url, '_blank');
    }
  };

  const handleDeleteImage = (photoId: string) => {
    setImageToDelete(photoId);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    
    try {
      const photoToDelete = photos.find(p => p.id === imageToDelete);
      if (photoToDelete && photoToDelete.url && photoToDelete.url.includes('firebasestorage')) {
        // Find storage reference from URL (optimistic try)
        try {
          const { ref, deleteObject } = await import('firebase/storage');
          const { storage } = await import('../firebase');
          const photoRef = ref(storage, photoToDelete.url);
          await deleteObject(photoRef);
        } catch (e) {
          console.error("Warning: Could not delete from storage, but continuing document deletion", e);
        }
      }

      await deleteDoc(doc(db, "events", event.id, "photos", imageToDelete));
      
      // Close ImageViewer if it was single image deleted and no others left
      if (photos.length <= 1) {
        setSelectedImageIndex(null);
      } else if (selectedImageIndex !== null && selectedImageIndex >= photos.length - 1) {
        setSelectedImageIndex(photos.length - 2);
      }
    } catch (error) {
      console.error("Napaka pri brisanju slike:", error);
      // Fallback alert for network errors, etc. Not blocked by all browsers, but console handle is enough.
    } finally {
      setImageToDelete(null);
    }
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const eventNameStr = event.eventType === 'poroka' || !event.eventType ? `${event.partner1}-${event.partner2}` : event.eventName;
      const folder = zip.folder(`Kliksy-${eventNameStr}`);
      
      if (!folder) throw new Error("Could not create zip folder");

      // Fetch all images and add them to the zip
      const promises = photos.map(async (photo, index) => {
        try {
          let response;
          if (photo.url.startsWith('data:')) {
            response = await fetch(photo.url);
          } else {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(photo.url)}`;
            response = await fetch(proxyUrl);
          }
          
          if (!response.ok && !photo.url.startsWith('data:')) throw new Error("Proxy fetch failed");
          
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
      saveAs(content, `Kliksy-${eventNameStr}.zip`);
      setDownloadError('');
    } catch (error) {
      console.error("Error creating zip file:", error);
      setDownloadError("Prišlo je do napake pri prenosu. Poskusite znova.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="font-bold text-2xl tracking-tight text-gray-900">
            Kliksy<span className="text-indigo-600">.</span>
          </Link>
        </div>
        
        <div className="p-6 flex-1">
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Tvoj dogodek</p>
            {events.length > 1 ? (
              <select
                value={event.id}
                onChange={(e) => {
                  const selected = events.find(ev => ev.id === e.target.value);
                  if (selected) {
                    setEvent(selected);
                    navigate(`/dashboard?eventId=${selected.id}`, { replace: true });
                  }
                }}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer truncate shadow-sm"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.eventType === 'poroka' || !ev.eventType ? `${ev.partner1} & ${ev.partner2}` : ev.eventName}
                  </option>
                ))}
              </select>
            ) : (
              <h2 className="font-bold tracking-tight text-xl text-gray-900 truncate">
                {event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName}
              </h2>
            )}
            <p className="text-sm text-gray-500 mt-2">{new Date(event.date).toLocaleDateString('sl-SI')}</p>
            {event.plan && (
              <div className="mt-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  event.paymentStatus !== 'paid' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                  event.plan === 'premium' ? 'bg-amber-50 text-amber-800 border-amber-200' : 
                  event.plan === 'plus' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  Paket: {event.paymentStatus !== 'paid' ? 'Demo' : event.plan.charAt(0).toUpperCase() + event.plan.slice(1)}
                </span>
              </div>
            )}
            
            <button
              onClick={() => navigate('/create')}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Dodaj nov dogodek
            </button>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button onClick={signOut} className="flex items-center gap-3 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
            <LogOut className="w-5 h-5" />
            Odjava
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {event.paymentStatus !== 'paid' && (
            <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-indigo-900 mb-2">Demo paket (omejeno na 5 slik)</h3>
                <p className="text-indigo-700">Trenutno preizkušate demo paket. Da bodo gostje lahko naložili več slik in dostopali do vseh funkcij, odklenite vaš dogodek.</p>
              </div>
              <button 
                onClick={() => navigate(`/create?eventId=${event.id}`)}
                className="shrink-0 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition md:ml-auto shadow-md shadow-indigo-200"
              >
                Odkleni moj dogodek
              </button>
            </div>
          )}

          {/* Header Actions */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors border border-transparent"
              >
                <ArrowLeft className="w-5 h-5 text-gray-900" />
              </button>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">
                  {activeTab === 'overview' && 'Pregled dogodka'}
                  {activeTab === 'gallery' && 'Vse fotografije'}
                  {activeTab === 'settings' && 'Nastavitve'}
                </h1>
                <p className="text-gray-500">
                  {event.eventType === 'poroka' || !event.eventType ? 'Upravljaj svoje poročne spomine.' : 
                   event.eventType === 'rojstni_dan' ? 'Upravljaj svoje rojstnodnevne spomine.' : 
                   event.eventType === 'poslovni_dogodek' ? 'Upravljaj spomine s poslovnega dogodka.' : 
                   event.eventType === 'teambuilding' ? 'Upravljaj spomine s teambuildinga.' : 
                   'Upravljaj spomine dogodka.'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <a 
                href={eventUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex-1 md:flex-none text-gray-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Poglej kot gost</span>
                <span className="sm:hidden">Gost</span>
              </a>
              <button 
                onClick={handleDownloadAll}
                disabled={isDownloading || photos.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 flex-1 md:flex-none"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{isDownloading ? "Pripravljam ZIP..." : "Prenesi vse (ZIP)"}</span>
                <span className="sm:hidden">{isDownloading ? "..." : "Prenesi vse"}</span>
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
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold tracking-tight text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* QR Code Card */}
                <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
                  <h3 className="font-bold tracking-tight text-xl mb-2 text-gray-900">Tvoja QR koda</h3>
                  <p className="text-sm text-gray-500 mb-8">Natisni to kodo in jo postavi na mize.</p>
                  
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-center">
                    <QRCodeSVG 
                      id="raw-qr-code-svg"
                      value={eventUrl} 
                      size={180}
                      bgColor={"#ffffff"}
                      fgColor={"#111827"}
                      level={"Q"}
                      includeMargin={false}
                    />
                  </div>
                  
                  <button 
                    onClick={() => setIsQRModalOpen(true)}
                    className="w-full py-3 px-4 mb-2 bg-gray-100 text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Prenesi QR kodo z designom
                  </button>
                  <button 
                    onClick={handleDownloadRawQR}
                    className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Prenesi samo QR kodo
                  </button>
                </div>

                {/* Recent Photos Preview */}
                <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold tracking-tight text-xl text-gray-900">Zadnje naloženo</h3>
                    <button onClick={() => setActiveTab('gallery')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                      Poglej vse
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos.slice(0, 6).map((photo, i) => (
                      <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group relative cursor-pointer" onClick={() => setSelectedImageIndex(i)}>
                        {photo.type === 'video' ? (
                          <video src={photo.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted playsInline />
                        ) : (
                          <img src={photo.url} alt="Wedding moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button onClick={(e) => { e.stopPropagation(); handleDownloadSingle(photo.url, i); }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Download className="w-5 h-5 text-gray-900" />
                          </button>
                        </div>
                        {/* Thumb Like Indicator */}
                        {photo.likes > 0 && (
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full pointer-events-none">
                            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                            <span className="text-white text-xs font-bold">{photo.likes}</span>
                          </div>
                        )}
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
                  <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group relative cursor-pointer" onClick={() => setSelectedImageIndex(i)}>
                    {photo.type === 'video' ? (
                      <video src={photo.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted playsInline />
                    ) : (
                      <img src={photo.url} alt="Wedding moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none"></div>
                    
                    {/* Action buttons (always visible on mobile, hover on desktop) */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-300">
                      <button 
                        onPointerDown={(e) => { e.stopPropagation(); }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteImage(photo.id); }} 
                        className="w-9 h-9 md:w-10 md:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 group/delete transition-colors"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-500 group-hover/delete:text-red-600" />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-300">
                      <button 
                        onPointerDown={(e) => { e.stopPropagation(); }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownloadSingle(photo.url, i); }} 
                        className="w-9 h-9 md:w-10 md:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                      </button>
                    </div>
                    {/* Thumb Like Indicator */}
                    {photo.likes > 0 && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full pointer-events-none">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                        <span className="text-white text-xs font-bold">{photo.likes}</span>
                      </div>
                    )}
                  </div>
                ))}
                {photos.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-500">
                    Še ni naloženih fotografij.
                  </div>
                )}
              </div>
              <div className="text-center pt-8">
                <button className="px-8 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 text-gray-700 transition-colors shadow-sm">
                  Naloži več
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-2xl"
            >
              <h3 className="font-bold tracking-tight text-xl mb-6 text-gray-900">Nastavitve dogodka</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Ime dogodka</label>
                  <input 
                    type="text" 
                    defaultValue={event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-900 bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Datum</label>
                  <input 
                    type="date" 
                    defaultValue={event.date}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-900 bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Pozdravno sporočilo za goste</label>
                  <textarea 
                    defaultValue={event.eventType === 'poroka' || !event.eventType ? "Hvala, ker deliš spomine z nama." : "Hvala, ker deliš spomine z nami."}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-gray-900"
                  />
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <button className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm">
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

      {selectedImageIndex !== null && (
        <ImageViewer
          images={photos}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          onToggleLike={handleToggleLike}
          onDelete={handleDeleteImage}
          currentUserId={user?.uid}
        />
      )}

      {/* Delete Confirmation Modal */}
      {imageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm -moz-backdrop-blur" onClick={() => setImageToDelete(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 text-center max-w-sm w-full shadow-xl"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Izbris slike</h3>
            <p className="text-gray-500 mb-6 font-medium leading-relaxed">Ta slika bo trajno izbrisana in odstranjena iz galerije. Tega dejanja ni mogoče razveljaviti.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setImageToDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-100 font-bold text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Prekliči
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 font-bold text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
              >
                Izbriši
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
