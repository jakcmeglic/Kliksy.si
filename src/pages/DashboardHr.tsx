import { SmartImage } from "../components/SmartImage";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Download, Image as ImageIcon, Users, Clock, Settings, ExternalLink, LogOut, Heart, Loader2, ArrowLeft, Plus, Trash2, Play } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { db, storage, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, getDocs, onSnapshot, doc, getDoc, orderBy, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from 'firebase/storage';
import QRModalHr from "../components/QRModalHr";
import ImageViewer from "../components/ImageViewer";

export default function DashboardHr() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlEventId = searchParams.get('eventId');
  const isSuccess = searchParams.get('success') === 'true';
  const isUpgradeSuccess = searchParams.get('upgradeSuccess') === 'true';
  const newUpgradePlan = searchParams.get('newPlan');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'settings'>('overview');
  const [event, setEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isUpgradingStatus, setIsUpgradingStatus] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [guestViewSettings, setGuestViewSettings] = useState<'all' | 'own'>('all');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (event) {
      setWelcomeMessage(event.welcomeMessage || (event.eventType === 'poroka' || !event.eventType ? "Hvala što dijeliš uspomene s nama." : "Hvala što dijeliš uspomene s nama."));
      setGuestViewSettings(event.guestViewSettings || 'all');
    }
  }, [event]);

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
                await updateDoc(eventDocRef, { 
                  paymentStatus: 'paid',
                  paidAt: new Date().toISOString() 
                });
                
                // Trigger order summary email
                fetch('/api/send-order-summary', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: eventData.email || user.email,
                    eventName: eventData.eventName || (eventData.partner1 ? `${eventData.partner1} & ${eventData.partner2}` : 'Vaš događaj'),
                    plan: eventData.plan,
                    amountPaid: eventData.amountPaid,
                    standsQuantity: eventData.standsQuantity,
                    printedQrQuantity: eventData.printedQrQuantity,
                    deliveryMode: eventData.deliveryMode,
                    lang: 'hr'
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

        // Handle successful UPGRADE redirect
        if (isUpgradeSuccess && urlEventId && newUpgradePlan) {
          try {
            const eventDocRef = doc(db, "events", urlEventId);
            await updateDoc(eventDocRef, { plan: newUpgradePlan });
            navigate(`/dashboard?eventId=${urlEventId}`, { replace: true });
            return;
          } catch (err) {
            console.error("Error updating plan status:", err);
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
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">Nemate još događaj</h2>
        <p className="text-gray-600 mb-8">Napravite svoj prvi događaj za početak skupljanja uspomena.</p>
        <Link to="/create" className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors shadow-sm">
          Napravi događaj
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
    { label: "Učitane slike", value: photos.length.toString(), icon: ImageIcon },
    { label: "Gosti", value: new Set(photos.map(p => p.deviceId).filter(Boolean)).size.toString() || "0", icon: Users },
    { label: "Zadnja slika", value: photos.length > 0 ? "Upravo" : "-", icon: Clock },
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
      console.error("Greška pri brisanju slike:", error);
      // Fallback alert for network errors, etc. Not blocked by all browsers, but console handle is enough.
    } finally {
      setImageToDelete(null);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    setDownloadError('');
    try {
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      
      const zip = new JSZip();
      let added = 0;
      
      console.log('Total photos:', photos.length);
      
      for (let i = 0; i < photos.length; i++) {
        try {
          const photo = photos[i];
          const url = photo.url || photo.downloadURL || photo.imageUrl;
          
          console.log('Fetching photo', i, url);
          
          const response = await fetch(url, { mode: 'cors' });
          const blob = await response.blob();
          
          console.log('Blob size:', blob.size, 'type:', blob.type);
          
          if (blob.size > 0) {
            zip.file(`photo-${i + 1}.jpg`, blob);
            added++;
          }
          
          setDownloadProgress(`Pripravljam ZIP... ${i + 1}/${photos.length}`);
        } catch (err) {
          console.error('Photo failed:', i, err);
        }
      }
      
      console.log('Photos added to ZIP:', added);
      
      if (added === 0) {
        alert('Nobena slika ni bila dodana v ZIP. Preverite konzolo za napake.');
        setIsDownloading(false);
        return;
      }
      
      setDownloadProgress('Ustvarjam datoteko...');
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'Kliksy-galerija.zip');
      setDownloadProgress('');
      
    } catch (err: any) {
      console.error('ZIP error:', err);
      alert('Napaka pri prenosu: ' + err.message);
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
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Tvoj događaj</p>
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
              <div className="mt-3 flex flex-col items-start gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  event.paymentStatus !== 'paid' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                  event.plan === 'premium' ? 'bg-amber-50 text-amber-800 border-amber-200' : 
                  event.plan === 'plus' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  Paket: {event.paymentStatus !== 'paid' ? 'Demo' : event.plan.charAt(0).toUpperCase() + event.plan.slice(1)}
                </span>
                
                {event.paymentStatus === 'paid' && event.plan !== 'premium' && (
                  <button 
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 transition-colors"
                  >
                    Nadgradi paket
                  </button>
                )}
              </div>
            )}
            
            <button
              onClick={() => navigate('/create')}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Dodaj novi događaj
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Pregled', icon: Clock },
              { id: 'gallery', label: 'Galerija', icon: ImageIcon },
              { id: 'settings', label: 'Postavke', icon: Settings },
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
                <h3 className="font-bold text-lg text-gray-900 mb-1">Ovo je Demo pregled</h3>
                <p className="text-gray-600 text-sm max-w-xl">
                  Vaš događaj je u demo načinu i ograničen na 5 slikaa. Za puno iskustvo nadogradite paket.
                </p>
              </div>
              <button 
                onClick={() => navigate(`/create?eventId=${event.id}`)} 
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"
              >
                Nadogradi sada
              </button>
            </div>
          )}

          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                      <stat.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
                 <div className="shrink-0 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                    <div className="w-[180px] h-[180px] relative" id="raw-qr-code-svg-container">
                       <QRCodeSVG 
                         id="raw-qr-code-svg"
                         value={eventUrl}
                         size={180}
                         level="H"
                         includeMargin={true}
                       />
                    </div>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-2xl text-gray-900 mb-2">QR kod događaja</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto md:mx-0">
                      Isprintajte ga i stavite na stolove. Gosti ga skeniraju aplikacijom kamere na svojim telefonima.
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                       <button
                         onClick={() => setIsQRModalOpen(true)}
                         className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                       >
                         Ispiši dizajne
                       </button>
                       <button
                         onClick={handleDownloadRawQR}
                         className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                       >
                         <Download className="w-5 h-5" />
                         Preuzmi samo kod
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <ExternalLink className="w-8 h-8 text-blue-600" />
                 </div>
                 <h3 className="font-bold text-xl text-gray-900 mb-2">Link do galerije</h3>
                 <p className="text-gray-500 mb-6">Link možete poslati i onima koji ne mogu skenirati kod.</p>
                 <div className="flex bg-gray-50 p-2 border border-gray-200 rounded-xl max-w-md mx-auto">
                   <input type="text" readOnly value={eventUrl} className="bg-transparent flex-1 px-3 text-gray-600 outline-none truncate" />
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(eventUrl);
                        alert("Link kopiran!");
                     }}
                     className="px-4 py-2 bg-white rounded-lg shadow-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
                   >
                     Kopiraj
                   </button>
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
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <div>
                   <h3 className="font-bold text-xl text-gray-900">Sve slikae događaja</h3>
                   <p className="text-gray-500 text-sm">Prikazuje se {photos.length} slika</p>
                 </div>
                 <button
                   onClick={handleDownloadAll}
                   disabled={isDownloading || photos.length === 0}
                   className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                 >
                   {isDownloading ? (
                     <div className="flex items-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       <span className="text-sm">{downloadProgress}</span>
                     </div>
                   ) : <Download className="w-5 h-5" />}
                   Preuzmi sve (ZIP)
                 </button>
               </div>
               
               {downloadError && (
                 <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                   {downloadError}
                 </div>
               )}

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {photos.map((photo, i) => (
                   <motion.div
                     key={photo.id}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.05 }}
                     className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative cursor-pointer group"
                     onClick={() => setSelectedImageIndex(i)}
                   >
                     {photo.type === 'video' ? (
                        <>
                          <video src={`${photo.url}#t=0.001`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" muted playsInline preload="metadata" />
                          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full p-2">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </>
                     ) : (
                        <SmartImage 
                          src={photo.url} 
                          alt="Moment" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy" 
                        />
                     )}
                     <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full pointer-events-none">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                        <span className="text-white text-xs font-bold">{photo.likes || 0}</span>
                     </div>
                   </motion.div>
                 ))}
                 
                 {photos.length === 0 && (
                   <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-3xl border border-gray-100 border-dashed">
                     Še ni slika. Delite QR kodo z gosti!
                   </div>
                 )}
               </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl"
            >
              <h3 className="font-bold tracking-tight text-xl mb-6 text-gray-900">Postavke događaja</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Ime događaja</label>
                  <input 
                    type="text" 
                    defaultValue={event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Datum</label>
                  <input 
                    type="date" 
                    defaultValue={event.date}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Poruka dobrodošlice za goste</label>
                  <textarea 
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Koje slike mogu vidjeti vaši gosti?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="guestViewSettings" 
                        value="all" 
                        checked={guestViewSettings === 'all'} 
                        onChange={() => setGuestViewSettings('all')}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">Vse slikae</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="guestViewSettings" 
                        value="own" 
                        checked={guestViewSettings === 'own'} 
                        onChange={() => setGuestViewSettings('own')}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">Samo svoje slikae</span>
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Če izberete "Samo svoje slikae", gostje v galeriji (ko skenirajo kodo) ne bodo videli slika drugih gostov, ampak samo tiste, ki so jih sami naložili.</p>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={async () => {
                      if (!event) return;
                      setIsSavingSettings(true);
                      try {
                        const eventDocRef = doc(db, "events", event.id);
                        await updateDoc(eventDocRef, { welcomeMessage, guestViewSettings });
                        setEvent({ ...event, welcomeMessage, guestViewSettings });
                        alert('Promjene su uspješno spremljene!');
                      } catch (err) {
                        console.error("Error saving settings:", err);
                        alert('Došlo je do pogreške pri spremanju.');
                      } finally {
                        setIsSavingSettings(false);
                      }
                    }}
                    disabled={isSavingSettings}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 min-w-[180px]"
                  >
                    {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Spremi promjene"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <QRModalHr 
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
            <p className="text-gray-500 mb-6 font-medium leading-relaxed">Ova slika bit će trajno izbrisana i uklonjena iz galerije. Ova se radnja ne može poništiti.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setImageToDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-100 font-bold text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Odustani
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 font-bold text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
              >
                Obriši
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm -moz-backdrop-blur" onClick={!isUpgradingStatus ? () => setIsUpgradeModalOpen(false) : undefined}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 md:p-8 text-center max-w-lg w-full shadow-xl relative"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nadogradite svoj paket</h3>
            <p className="text-gray-500 mb-6">Odaberite viši paket za više funkcionalnosti. Platit ćete samo razliku u cijeni.</p>
            
            <div className="space-y-4 mb-8">
              {(event?.plan === 'osnovni' || event?.plan === 'basic') && (
                <button 
                  onClick={async () => {
                    setIsUpgradingStatus(true);
                    try {
                      const resp = await fetch('/api/create-upgrade-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          currentPlan: 'basic',
                          newPlan: 'plus',
                          eventId: event.id,
                          successUrl: `${window.location.origin}/dashboard?eventId=${event.id}&upgradeSuccess=true&newPlan=plus`,
                          cancelUrl: `${window.location.origin}/dashboard?eventId=${event.id}&cancelUpgrade=true`
                        })
                      });
                      const data = await resp.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert("Greška u povezivanju sa sustavom naplate.");
                        setIsUpgradingStatus(false);
                      }
                    } catch (err) {
                      alert("Greška pri povezivanju.");
                      setIsUpgradingStatus(false);
                    }
                  }}
                  disabled={isUpgradingStatus}
                  className="w-full flex items-center justify-between p-4 border-2 border-blue-100 rounded-xl hover:border-blue-500 transition-all text-left bg-blue-50/50 group"
                >
                  <div className="pr-4">
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-700">Nadogradi na Plus</h4>
                    <p className="text-sm text-gray-500">Neograničeno slika, duži pristup galeriji, live galerija</p>
                  </div>
                  <div className="font-bold text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg shrink-0">+ 10€</div>
                </button>
              )}

              <button 
                onClick={async () => {
                    setIsUpgradingStatus(true);
                    try {
                      const resp = await fetch('/api/create-upgrade-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          currentPlan: event.plan === 'osnovni' ? 'basic' : event.plan,
                          newPlan: 'premium',
                          eventId: event.id,
                          successUrl: `${window.location.origin}/dashboard?eventId=${event.id}&upgradeSuccess=true&newPlan=premium`,
                          cancelUrl: `${window.location.origin}/dashboard?eventId=${event.id}&cancelUpgrade=true`
                        })
                      });
                      const data = await resp.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert("Greška u povezivanju sa sustavom naplate.");
                        setIsUpgradingStatus(false);
                      }
                    } catch (err) {
                      alert("Greška pri povezivanju.");
                      setIsUpgradingStatus(false);
                    }
                }}
                disabled={isUpgradingStatus}
                 className="w-full flex items-center justify-between p-4 border-2 border-amber-100 rounded-xl hover:border-amber-500 transition-all text-left bg-amber-50/50 group"
              >
                  <div className="pr-4">
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-amber-700">Nadogradi na Premium</h4>
                    <p className="text-sm text-gray-500">Sve iz Plus paketa + podrška za prijenos videa</p>
                  </div>
                  <div className="font-bold text-amber-600 bg-amber-100 px-3 py-1.5 rounded-lg shrink-0">
                    + {(event?.plan === 'osnovni' || event?.plan === 'basic') ? '40' : '30'}€
                  </div>
              </button>
            </div>

            <button 
              onClick={() => setIsUpgradeModalOpen(false)}
              disabled={isUpgradingStatus}
              className="w-full py-3 text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50"
            >
              Odustani
            </button>
            
            {isUpgradingStatus && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
