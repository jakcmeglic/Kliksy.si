import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Download, Image as ImageIcon, Users, Clock, Settings, ExternalLink, LogOut, Heart, Loader2, ArrowLeft, Plus, Trash2, Play } from "lucide-react";
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
      setWelcomeMessage(event.welcomeMessage || (event.eventType === 'poroka' || !event.eventType ? "Hvala, ker deliš spomine z nama." : "Hvala, ker deliš spomine z nami."));
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
    setDownloadProgress('0%');
    try {
      const zip = new JSZip();
      const eventNameStr = event.eventType === 'poroka' || !event.eventType ? `${event.partner1}-${event.partner2}` : event.eventName;
      const folder = zip.folder(`Kliksy-${eventNameStr}`);
      
      if (!folder) throw new Error("Could not create zip folder");

      // Fetch all images and add them to the zip
      let fetchedCount = 0;
      const batchSize = 10;
      for (let i = 0; i < photos.length; i += batchSize) {
        const batch = photos.slice(i, i + batchSize);
        await Promise.all(batch.map(async (photo, index) => {
          const actualIndex = i + index;
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
            
            let extension = photo.type === 'video' ? 'mp4' : 'jpg';
            if (blob.type && !blob.type.includes('octet-stream')) {
              const split = blob.type.split('/');
              if (split.length > 1) {
                // handle image/jpeg -> jpeg, video/mp4 -> mp4
                extension = split[1];
                if (extension === 'jpeg') extension = 'jpg';
              }
            }
            
            const prefix = photo.type === 'video' ? 'video' : 'photo';
            folder.file(`${prefix}-${actualIndex + 1}.${extension}`, blob);
            fetchedCount++;
            setDownloadProgress(`${Math.round((fetchedCount / photos.length) * 50)}%`);
          } catch (err) {
            console.error(`Failed to download media ${actualIndex}`, err);
          }
        }));
      }
      
      const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
        setDownloadProgress((50 + (metadata.percent / 2)).toFixed(0) + '%');
      });
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
                <h3 className="font-bold text-lg text-gray-900 mb-1">To je Demo predogled</h3>
                <p className="text-gray-600 text-sm max-w-xl">
                  Vaš dogodek je trenutno v demo načinu in omejen na maksimalno 5 slik. Za polno izkušnjo nadgradite paket.
                </p>
              </div>
              <button 
                onClick={() => navigate(`/create?eventId=${event.id}`)} 
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"
              >
                Nadgradi zdaj
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
                    <h3 className="font-bold text-2xl text-gray-900 mb-2">QR koda dogodka</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto md:mx-0">
                      Natisnite jo in postavite na mize. Gostje jo skenirajo z aplikacijo kamere na telefonu.
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                       <button
                         onClick={() => setIsQRModalOpen(true)}
                         className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                       >
                         Natisni dizajne
                       </button>
                       <button
                         onClick={handleDownloadRawQR}
                         className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                       >
                         <Download className="w-5 h-5" />
                         Prenesi samo kodo
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <ExternalLink className="w-8 h-8 text-blue-600" />
                 </div>
                 <h3 className="font-bold text-xl text-gray-900 mb-2">Povezava do galerije</h3>
                 <p className="text-gray-500 mb-6">Povezavo lahko pošljete tudi tistim, ki ne morejo skenirati kode.</p>
                 <div className="flex bg-gray-50 p-2 border border-gray-200 rounded-xl max-w-md mx-auto">
                   <input type="text" readOnly value={eventUrl} className="bg-transparent flex-1 px-3 text-gray-600 outline-none truncate" />
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(eventUrl);
                        alert("Povezava kopirana!");
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
                   <h3 className="font-bold text-xl text-gray-900">Vse slike dogodka</h3>
                   <p className="text-gray-500 text-sm">Gledate {photos.length} slik</p>
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
                   Prenesi vse (ZIP)
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
                        <img 
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
                     Še ni slik. Delite QR kodo z gosti!
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
              <h3 className="font-bold tracking-tight text-xl mb-6 text-gray-900">Nastavitve dogodka</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Ime dogodka</label>
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
                  <label className="block text-sm font-medium mb-2 text-gray-700">Pozdravno sporočilo za goste</label>
                  <textarea 
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Katere slike lahko vidijo vaši gosti?</label>
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
                      <span className="text-gray-700">Vse slike</span>
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
                      <span className="text-gray-700">Samo svoje slike</span>
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Če izberete "Samo svoje slike", gostje v galeriji (ko skenirajo kodo) ne bodo videli slik drugih gostov, ampak samo tiste, ki so jih sami naložili.</p>
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
                        alert('Spremembe so bile uspešno shranjene!');
                      } catch (err) {
                        console.error("Error saving settings:", err);
                        alert('Prišlo je do napake pri shranjevanju.');
                      } finally {
                        setIsSavingSettings(false);
                      }
                    }}
                    disabled={isSavingSettings}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 min-w-[180px]"
                  >
                    {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Shrani spremembe"}
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

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm -moz-backdrop-blur" onClick={!isUpgradingStatus ? () => setIsUpgradeModalOpen(false) : undefined}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 md:p-8 text-center max-w-lg w-full shadow-xl relative"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nadgradite svoj paket</h3>
            <p className="text-gray-500 mb-6">Izberite višji paket za več funkcionalnosti. Plačali boste le razliko v ceni.</p>
            
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
                        alert("Napaka pri povezavi s plačilnim sistemom.");
                        setIsUpgradingStatus(false);
                      }
                    } catch (err) {
                      alert("Napaka pri povezavi.");
                      setIsUpgradingStatus(false);
                    }
                  }}
                  disabled={isUpgradingStatus}
                  className="w-full flex items-center justify-between p-4 border-2 border-blue-100 rounded-xl hover:border-blue-500 transition-all text-left bg-blue-50/50 group"
                >
                  <div className="pr-4">
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-700">Nadgradi na Plus</h4>
                    <p className="text-sm text-gray-500">Neomejeno slik, daljši dostop do galerije, live galerija</p>
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
                        alert("Napaka pri povezavi s plačilnim sistemom.");
                        setIsUpgradingStatus(false);
                      }
                    } catch (err) {
                      alert("Napaka pri povezavi.");
                      setIsUpgradingStatus(false);
                    }
                }}
                disabled={isUpgradingStatus}
                 className="w-full flex items-center justify-between p-4 border-2 border-amber-100 rounded-xl hover:border-amber-500 transition-all text-left bg-amber-50/50 group"
              >
                  <div className="pr-4">
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-amber-700">Nadgradi na Premium</h4>
                    <p className="text-sm text-gray-500">Vse iz Plus paketa + podpora za nalaganje videoposnetkov</p>
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
              Prekliči
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
