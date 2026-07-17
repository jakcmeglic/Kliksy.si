import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SmartImage } from "../components/SmartImage";
import { loadHeic2Any } from "../heicLoader";
import { Camera, Upload, CheckCircle2, Plus, Heart, Loader2, Download, ArrowLeft, ChevronUp, Play } from "lucide-react";
import { db, storage, handleFirestoreError, OperationType } from "../firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, Timestamp, query, orderBy, limit, onSnapshot, getDocs, updateDoc, arrayUnion, arrayRemove, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function TikTokLikeButton({ photo, deviceId, onToggleLike }: any) {
  const isLikedInData = photo.likedBy?.includes(deviceId);
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | undefined>(undefined);
  
  const isLiked = optimisticLiked !== undefined ? optimisticLiked : isLikedInData;
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOptimisticLiked(!isLiked);
    onToggleLike(photo.id);
  };

  const likesCount = isLiked && !isLikedInData 
    ? (photo.likes || 0) + 1 
    : !isLiked && isLikedInData 
      ? Math.max(0, (photo.likes || 1) - 1)
      : (photo.likes || 0);

  return (
    <div className="absolute right-4 bottom-24 flex flex-col items-center gap-2 z-50">
      <button 
        onClick={handleLike} 
        className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all outline-none border border-white/10"
      >
        <Heart className={`w-8 h-8 transition-colors ${isLiked ? 'text-red-500 fill-red-500 scale-110' : 'text-white'}`} />
      </button>
      {likesCount > 0 && <span className="text-white font-bold drop-shadow-md text-lg">{likesCount}</span>}
    </div>
  );
}

export default function GuestViewHr() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const isUploadingRef = useRef(false);
  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploadingRef.current) {
        e.preventDefault();
        e.returnValue = 'Slike se još uvijek učitavaju. Jeste li sigurni da želite zatvoriti aplikaciju?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [galleryMode, setGalleryMode] = useState<'scroll' | 'grid'>('scroll');
  const [allPhotos, setAllPhotos] = useState<any[]>([]);
  const [hasScrolledGallery, setHasScrolledGallery] = useState(false);
  const [videoCount, setVideoCount] = useState(0);

  const [deviceId] = useState(() => {
    let id: string | null = null;
    try {
      id = localStorage.getItem('guestDeviceId');
    } catch (e) {
      console.warn("localStorage ni na voljo (verjetno in-app brskalnik)", e);
    }
    
    if (!id) {
      id = uuidv4();
      try {
        localStorage.setItem('guestDeviceId', id);
      } catch (e) {
        console.warn("Nije bilo moguće spremiti u localStorage.", e);
      }
    }
    return id;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;

    let timeoutId: any;

    const initEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        
        // Timeout to stop endless loading spinner
        timeoutId = setTimeout(() => {
          setLoading(false);
        }, 5000);

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    initEvent();

    // Do auth in background: one-shot listener
    let isFired = false;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      isFired = true;
      if (unsubscribe) unsubscribe(); // Usually works for asynchronous
      
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.warn("Anonymous auth failed or disabled.", e);
        }
      }
    });

    // If it fired synchronously, unsubscribe will now be defined, we can call it.
    if (isFired && unsubscribe) {
      unsubscribe();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    if (!id || event?.plan !== 'premium') return;

    const q = query(
      collection(db, "events", id, "photos"),
      where("type", "==", "video")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVideoCount(snapshot.size);
    }, (error) => {
      console.error("Error fetching video count:", error);
    });

    return () => unsubscribe();
  }, [id, event?.plan]);

  useEffect(() => {
    if (!id) return;

    let q;
    if (event?.guestViewSettings === 'own') {
      q = query(
        collection(db, "events", id, "photos"),
        where("deviceId", "==", deviceId)
      );
    } else {
      q = query(
        collection(db, "events", id, "photos"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (event?.guestViewSettings === 'own') {
        newPhotos.sort((a: any, b: any) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tB - tA;
        });
        newPhotos = newPhotos.slice(0, 6);
      }
      setRecentPhotos(newPhotos);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `events/${id}/photos`);
    });

    return () => unsubscribe();
  }, [id, event?.guestViewSettings, deviceId]);

  const [hasOpenedModal, setHasOpenedModal] = useState(false);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      setHasScrolledGallery(false);
      setHasOpenedModal(true);
    }
  }, [selectedImageIndex]);

  useEffect(() => {
    if (!id || !hasOpenedModal) return;

    let q;
    if (event?.guestViewSettings === 'own') {
      q = query(
        collection(db, "events", id, "photos"),
        where("deviceId", "==", deviceId)
      );
    } else {
      q = query(
        collection(db, "events", id, "photos"),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (event?.guestViewSettings === 'own') {
        newPhotos.sort((a: any, b: any) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tB - tA;
        });
      }
      setAllPhotos(newPhotos);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `events/${id}/photos_gallery`);
    });

    return () => unsubscribe();
  }, [id, hasOpenedModal, event?.guestViewSettings, deviceId]);

  const handleToggleLike = async (photoId: string) => {
    if (!id || !deviceId) return;

    try {
      const photoRef = doc(db, "events", id, "photos", photoId);
      const photoSnap = await getDoc(photoRef);
      
      if (photoSnap.exists()) {
        const photoData = photoSnap.data();
        const likedBy = photoData.likedBy || [];
        const isLiked = likedBy.includes(deviceId);
        
        if (isLiked) {
          await updateDoc(photoRef, {
            likedBy: arrayRemove(deviceId),
            likes: Math.max(0, (photoData.likes || 1) - 1)
          });
        } else {
          await updateDoc(photoRef, {
            likedBy: arrayUnion(deviceId),
            likes: (photoData.likes || 0) + 1
          });
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files: File[] = Array.from(e.target.files || []);
    if (files.length === 0 || !id) return;

    setUploadError('');

    const isDemo = event?.paymentStatus !== 'paid';
    if (isDemo) {
      const allowedRemaining = Math.max(0, 5 - recentPhotos.length);
      if (allowedRemaining === 0) {
        setUploadError("Ovo je demo događaj. Dosegnuto je ograničenje od 5 slika.");
        return;
      }
      if (files.length > allowedRemaining) {
        setUploadError(`Ovo je demo događaj. Možete učitati samo još ${allowedRemaining} slika.`);
        files = files.slice(0, allowedRemaining); // Optional: just slice it or return. Let's return out of caution to not surprise user.
        return;
      }
    }

    const isPremium = event?.plan === 'premium';
    const hasSpaceForVideo = videoCount < 100;
    
    files = files.filter(file => {
      const isVideo = file.type.startsWith('video/');
      if (isVideo && (!isPremium || !hasSpaceForVideo)) {
         return false; // Skip videos if not allowed
      }
      return true;
    });
    
    if (files.length === 0) {
       setUploadError("Učitavanje videoposnetkov ni omogočeno ali pa je bila dosežena omejitev (100).");
       return;
    }

    setUploadProgress({ current: 0, total: files.length });
    isUploadingRef.current = true;
    let successCount = 0;
    
    const uploadTask = async () => {
      try {
        const chunkSize = 3;
        for (let i = 0; i < files.length; i += chunkSize) {
          const chunk = Array.from(files).slice(i, i + chunkSize);
          
          await Promise.all(chunk.map(async (file) => {
            try {
              let fileToUpload: File | Blob = file;
              const isVideo = file.type.startsWith('video/');
              let uploadContentType = file.type;
              let originalName = file.name;
              
              if (!isVideo) {
                try {
                  let fileForCompression = file;
                  
                  // Convert HEIC/HEIF to JPEG before compressing and uploading
                  if (
                    file.type === "image/heic" || 
                    file.type === "image/heif" || 
                    file.name.toLowerCase().endsWith(".heic") || 
                    file.name.toLowerCase().endsWith(".heif")
                  ) {
                    setIsConvertingHeic(true);
                    try {
                      const heic2anyFn = await loadHeic2Any();
                      const convertedBlob = await heic2anyFn({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.8
                      });
                      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                    
                    originalName = file.name.replace(/\.heic$/i, ".jpg").replace(/\.heif$/i, ".jpg");
                    fileForCompression = new File([blob], originalName, { type: "image/jpeg" });
                    uploadContentType = "image/jpeg";
                    } finally {
                      setIsConvertingHeic(false);
                    }
                  }
                  
                  const options = { maxSizeMB: 5, maxWidthOrHeight: 4000, useWebWorker: true };
                  fileToUpload = await imageCompression(fileForCompression, options);
                } catch (compressionError) {
                  // Fall back to original file if compression fails
                  console.error("Compression/Conversion error:", compressionError);
                }
              }

              const extension = originalName.split('.').pop() || (isVideo ? 'mp4' : 'jpg');
              const fileName = `${Date.now()}-${uuidv4()}.${extension}`;
              const storageRef = ref(storage, `events/${id}/${fileName}`);
              
              await uploadBytes(storageRef, fileToUpload, { contentType: uploadContentType });
              const downloadUrl = await getDownloadURL(storageRef);

              await addDoc(collection(db, "events", id, "photos"), {
                url: downloadUrl,
                eventId: id,
                deviceId: deviceId,
                type: isVideo ? 'video' : 'image',
                createdAt: Timestamp.now(),
                likes: 0,
                likedBy: []
              });
              
              successCount++;
              setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
            } catch (fileError: any) {
              console.error("Error uploading a file in loop:", fileError);
            }
          }));
        }

        if (successCount > 0) {
          setUploadSuccess(true);
          setUploadError('');
          setTimeout(() => {
            setUploadSuccess(false);
            setUploadProgress({ current: 0, total: 0 });
          }, 3000);
        } else {
          setUploadError("Nije bilo moguće učitati nijednu sliku. Pokušajte ponovno.");
          setUploadProgress({ current: 0, total: 0 });
        }
      } catch (error: any) {
        setUploadProgress({ current: 0, total: 0 });
        const errorMessage = error.message ? `Pogreška: ${error.message}` : "Došlo je do pogreške pri učitavanju. Pokušajte ponovno.";
        setUploadError(errorMessage);
        console.error("Upload error:", error);
      } finally {
        isUploadingRef.current = false;
      }
    };

    // Run upload without awaiting
    uploadTask();
    
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Dogodek ne obstaja</h2>
        <p className="text-gray-600 mb-8">Preverite povezavo ali QR kodo.</p>
        <Link to="/" className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors">
          Na prvo stran
        </Link>
      </div>
    );
  }

  const canUploadVideo = event?.plan === 'premium' && videoCount < 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Hidden Inputs */}
      <input 
        type="file" 
        accept="image/*"
        capture="environment"
        className="hidden" 
        ref={cameraInputRef}
        onChange={handleFileSelect}
      />
      <input 
        type="file" 
        accept={canUploadVideo ? "image/*,video/*" : "image/*"}
        multiple
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      {/* Header */}
      <header className="px-6 py-8 text-center bg-white rounded-b-3xl shadow-sm border-b border-gray-100 relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-4">
          <Heart className="w-6 h-6 text-indigo-600 fill-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName}
        </h1>
        <p className="text-gray-500 text-sm">
          {event.welcomeMessage || (event.eventType === 'poroka' || !event.eventType ? 'Hvala što dijelite uspomene s nama.' : 'Hvala što dijelite uspomene s nama.')}
        </p>
      </header>

      {/* Main Actions */}
      <main className="flex-1 px-6 py-8 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
            <motion.div 
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-4 relative"
            >
              {/* Progress Toast */}
              {isConvertingHeic && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex justify-center"
                >
                  <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm border border-amber-100 mb-2">
                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
                     Pretvaranje HEIC... (ovo može potrajati nekoliko sekundi)
                  </div>
                </motion.div>
              )}
              {uploadProgress.total > 0 && !isConvertingHeic && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex justify-center"
                >
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm border border-indigo-100">
                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
                     Učitavam ({uploadProgress.current}/{uploadProgress.total})...
                  </div>
                </motion.div>
              )}
              {uploadSuccess && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-center"
                >
                  <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm border border-green-100">
                     <CheckCircle2 className="w-3.5 h-3.5" />
                     Uspješno učitano!
                  </div>
                </motion.div>
              )}

              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="w-full bg-gray-900 text-white p-6 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <span className="text-xl font-bold">Slikaj sad</span>
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white text-gray-900 p-6 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-all active:scale-95 border-2 border-gray-100"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-900" />
                </div>
                <span className="text-xl font-bold">Učitaj iz galerije</span>
              </button>

              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm text-center">
                  {uploadError}
                </div>
              )}
            </motion.div>
        </AnimatePresence>

        {/* Live Feed Preview */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full mt-12"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-900">{event?.guestViewSettings === 'own' ? 'Moje slike' : 'Zadnje uspomene'}</h3>
                <span className="text-xs font-medium bg-indigo-50 px-2 py-1 rounded-full text-indigo-600">Uživo</span>
              </div>
              {(recentPhotos.length > 0) && (
                <button onClick={() => setSelectedImageIndex(0)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                  Pogledaj sve
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {recentPhotos.slice(0, 6).map((photo, index) => (
                <motion.div 
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer relative"
                  onClick={() => {
                    const actualIndex = allPhotos.findIndex(p => p.id === photo.id);
                    setSelectedImageIndex(actualIndex >= 0 ? actualIndex : 0);
                  }}
                >
                  {photo.type === 'video' ? (
                    <>
                      <video src={`${photo.url}#t=0.001`} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                      <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full p-1">
                        <Play className="w-3 h-3 text-white fill-white" />
                      </div>
                    </>
                  ) : (
                    <SmartImage src={photo.url} alt="Wedding moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  )}

                  {/* Thumb Like Indicator */}
                  {photo.likes > 0 && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full pointer-events-none">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-white text-xs font-bold">{photo.likes}</span>
                    </div>
                  )}
                </motion.div>
              ))}
              {recentPhotos.length === 0 && (
                <div className="col-span-3 py-8 text-center text-sm text-gray-500">
                  Budi prvi koji će učitati fotografiju!
                </div>
              )}
            </div>
          </motion.div>
      </main>

      {/* TikTok Gallery Overlay */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            
            {/* Top Bar Navigation */}
            <div className="absolute top-0 inset-x-0 p-4 pt-safe flex items-center justify-between z-50 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
              <button 
                onClick={() => setSelectedImageIndex(null)}
                className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white pointer-events-auto active:scale-95 transition-transform border border-white/10"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full p-1 pointer-events-auto border border-white/10 shadow-lg">
                <button 
                  onClick={() => setGalleryMode('scroll')}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${galleryMode === 'scroll' ? 'bg-white text-black' : 'text-white/80 hover:text-white'}`}
                >
                  Listanje
                </button>
                <button 
                  onClick={() => setGalleryMode('grid')}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${galleryMode === 'grid' ? 'bg-white text-black' : 'text-white/80 hover:text-white'}`}
                >
                  Mrežni prikaz
                </button>
              </div>
              <div className="w-12 h-12" /> {/* Spacer for centering */}
            </div>

            {/* Gallery Area */}
            {galleryMode === 'scroll' ? (
              <>
                {/* Scrollable Area */}
                <div 
                  ref={(node) => {
                    if (node && selectedImageIndex !== null && !node.dataset.scrolled && allPhotos.length > 0) {
                      const element = node.children[selectedImageIndex] as HTMLElement;
                      if (element) {
                        node.scrollTop = element.offsetTop;
                        node.dataset.scrolled = 'true';
                      }
                    }
                  }}
                  className="flex-1 overflow-y-auto snap-y snap-mandatory h-full hide-scrollbar"
                  onScroll={() => { if (!hasScrolledGallery) setHasScrolledGallery(true); }}
                >
                  {allPhotos.map((photo) => (
                    <div key={photo.id} className="w-full h-[100dvh] snap-start snap-always relative flex items-center justify-center bg-black">
                      {photo.type === 'video' ? (
                        <video 
                          src={photo.url} 
                          className="w-full h-full object-contain" 
                          autoPlay={false} 
                          preload="metadata"
                          controls
                          muted 
                          loop 
                          playsInline 
                        />
                      ) : (
                        <SmartImage src={photo.url} alt="Gallery item" className="w-full h-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                      )}
                      <TikTokLikeButton photo={photo} deviceId={deviceId} onToggleLike={handleToggleLike} />
                    </div>
                  ))}
                  
                  {allPhotos.length === 0 && (
                    <div className="flex items-center justify-center h-full text-white/60">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Scroll Indiciator Hint */}
                <AnimatePresence>
                  {!hasScrolledGallery && allPhotos.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center pointer-events-none"
                    >
                      <motion.div
                        animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-white font-medium text-sm mb-2 drop-shadow-lg bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Povuci prema gore</span>
                        <ChevronUp className="w-8 h-8 text-white drop-shadow-lg" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto pt-24 px-4 pb-12 bg-black pointer-events-auto hide-scrollbar">
                <div className="grid grid-cols-3 gap-2">
                  {allPhotos.map((photo, i) => (
                    <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-gray-900 cursor-pointer relative" onClick={() => { setSelectedImageIndex(i); setGalleryMode('scroll'); }}>
                      {photo.type === 'video' ? (
                        <>
                          <video src={`${photo.url}#t=0.001`} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full p-1 border border-white/10 shadow-sm pointer-events-none">
                            <Play className="w-3 h-3 text-white fill-white" />
                          </div>
                        </>
                      ) : (
                        <SmartImage src={photo.url} alt="Gallery item" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                      )}
                      {/* Thumb Like Indicator */}
                      {photo.likes > 0 && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full pointer-events-none">
                          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                          <span className="text-white text-xs font-bold">{photo.likes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
