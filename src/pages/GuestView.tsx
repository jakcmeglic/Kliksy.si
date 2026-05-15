import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, CheckCircle2, Plus, Heart, Loader2, Download, ArrowLeft, ChevronUp } from "lucide-react";
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

export default function GuestView() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
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
        console.warn("Ni bilo mogoče shraniti v localStorage.", e);
      }
    }
    return id;
  });

  const [uploadingPreviews, setUploadingPreviews] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;

    const initEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
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

    const q = query(
      collection(db, "events", id, "photos"),
      orderBy("createdAt", "desc"),
      limit(6)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentPhotos(newPhotos);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `events/${id}/photos`);
    });

    return () => unsubscribe();
  }, [id]);

  const [hasOpenedModal, setHasOpenedModal] = useState(false);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      setHasScrolledGallery(false);
      setHasOpenedModal(true);
    }
  }, [selectedImageIndex]);

  useEffect(() => {
    if (!id || !hasOpenedModal) return;

    const q = query(
      collection(db, "events", id, "photos"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllPhotos(newPhotos);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `events/${id}/photos_gallery`);
    });

    return () => unsubscribe();
  }, [id, hasOpenedModal]);

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
       setUploadError("Nalaganje videoposnetkov ni omogočeno ali pa je bila dosežena omejitev (100).");
       return;
    }

    setUploadProgress({ current: 0, total: files.length });
    
    // Generate previews
    const newPreviews = files.map(file => ({
      id: `local-${uuidv4()}`,
      url: URL.createObjectURL(file), // Generate local URL
      type: file.type.startsWith('video/') ? 'video' : 'image',
      file: file,
      likes: 0,
      isUploading: true
    }));
    
    setUploadingPreviews(prev => [...newPreviews, ...prev]);
    let successCount = 0;
    
    const uploadTask = async () => {
      try {
        const chunkSize = 3;
        for (let i = 0; i < files.length; i += chunkSize) {
          const chunk = Array.from(files).slice(i, i + chunkSize);
          const chunkPreviews = newPreviews.slice(i, i + chunkSize);
          
          await Promise.all(chunk.map(async (file, index) => {
            const preview = chunkPreviews[index];
            try {
              let fileToUpload: File | Blob = file;
              const isVideo = file.type.startsWith('video/');
              
              if (!isVideo) {
                try {
                  const options = { maxSizeMB: 5, maxWidthOrHeight: 4000, useWebWorker: true };
                  fileToUpload = await imageCompression(file, options);
                } catch (compressionError) {
                  // Fall back to original file if compression fails
                }
              }

              const extension = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg');
              const fileName = `${Date.now()}-${uuidv4()}.${extension}`;
              const storageRef = ref(storage, `events/${id}/${fileName}`);
              
              await uploadBytes(storageRef, fileToUpload, { contentType: file.type });
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
            } finally {
              // Remove preview whether error or success to clean up blob URL
              setUploadingPreviews(prev => prev.filter(p => p.id !== preview.id));
              URL.revokeObjectURL(preview.url);
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
          setUploadError("Nobene slike ni bilo mogoče naložiti. Poskusite znova.");
          setUploadProgress({ current: 0, total: 0 });
        }
      } catch (error: any) {
        setUploadProgress({ current: 0, total: 0 });
        const errorMessage = error.message ? `Napaka: ${error.message}` : "Prišlo je do napake pri nalaganju. Poskusite znova.";
        setUploadError(errorMessage);
        console.error("Upload error:", error);
        // Clear all remaining previews
        newPreviews.forEach(p => URL.revokeObjectURL(p.url));
        setUploadingPreviews(prev => prev.filter(p => !newPreviews.find(np => np.id === p.id)));
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
        accept={canUploadVideo ? "image/*,video/*" : "image/*"}
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
          {event.eventType === 'poroka' || !event.eventType ? 'Hvala, ker deliš spomine z nama.' : 'Hvala, ker deliš spomine z nami.'}
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
              {uploadProgress.total > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-0 right-0 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm border border-indigo-100"
                >
                   <Loader2 className="w-4 h-4 animate-spin" />
                   Nalagam ({uploadProgress.current}/{uploadProgress.total})...
                </motion.div>
              )}
              {uploadSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-12 left-0 right-0 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm border border-green-100"
                >
                   <CheckCircle2 className="w-4 h-4" />
                   Uspešno naloženo!
                </motion.div>
              )}

              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="w-full bg-gray-900 text-white p-6 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <span className="text-xl font-bold">Slikaj zdaj</span>
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white text-gray-900 p-6 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-all active:scale-95 border-2 border-gray-100"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-900" />
                </div>
                <span className="text-xl font-bold">Naloži iz galerije</span>
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
                <h3 className="font-bold text-lg text-gray-900">Zadnji spomini</h3>
                <span className="text-xs font-medium bg-indigo-50 px-2 py-1 rounded-full text-indigo-600">V živo</span>
              </div>
              {(uploadingPreviews.length > 0 || recentPhotos.length > 0) && (
                <button onClick={() => setSelectedImageIndex(0)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                  Poglej vse
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[...uploadingPreviews, ...recentPhotos].slice(0, 6).map((photo, index) => (
                <motion.div 
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer relative"
                  onClick={() => {
                    if (!photo.isUploading) {
                      // Adjust index since uploading previews might not be in allPhotos
                      const actualIndex = allPhotos.findIndex(p => p.id === photo.id);
                      setSelectedImageIndex(actualIndex >= 0 ? actualIndex : 0);
                    }
                  }}
                >
                  {photo.type === 'video' ? (
                    <video src={photo.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                  ) : (
                    <img src={photo.url} alt="Wedding moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  )}
                  
                  {photo.isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}

                  {/* Thumb Like Indicator */}
                  {!photo.isUploading && photo.likes > 0 && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full pointer-events-none">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-white text-xs font-bold">{photo.likes}</span>
                    </div>
                  )}
                </motion.div>
              ))}
              {uploadingPreviews.length === 0 && recentPhotos.length === 0 && (
                <div className="col-span-3 py-8 text-center text-sm text-gray-500">
                  Bodi prvi, ki naloži fotografijo!
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
              <div className="text-white/90 font-bold px-5 py-2 bg-black/40 backdrop-blur-md rounded-full pointer-events-auto border border-white/10 shadow-lg">
                Galerija
              </div>
              <div className="w-12 h-12" /> {/* Spacer for centering */}
            </div>

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
                    <img src={photo.url} alt="Gallery item" className="w-full h-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
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
                    <span className="text-white font-medium text-sm mb-2 drop-shadow-lg bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Potegni navzgor</span>
                    <ChevronUp className="w-8 h-8 text-white drop-shadow-lg" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
