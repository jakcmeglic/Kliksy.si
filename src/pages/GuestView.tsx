import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, CheckCircle2, Plus, Heart, Loader2, Download } from "lucide-react";
import { db, storage, handleFirestoreError, OperationType } from "../firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import ImageViewer from "../components/ImageViewer";

export default function GuestView() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  
  const [deviceId] = useState(() => {
    let id = localStorage.getItem('guestDeviceId');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('guestDeviceId', id);
    }
    return id;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;

    const initGuest = async () => {
      try {
        await new Promise<void>((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (!user) {
              try {
                await signInAnonymously(auth);
              } catch (e) {
                console.warn("Anonymous auth failed or is disabled. Please enable Anonymous Authentication in Firebase Console.", e);
              }
            }
            resolve();
          });
        });

        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error initializing guest view:", error);
      } finally {
        setLoading(false);
      }
    };

    initGuest();
  }, [id]);

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

  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0 || !id) return;

    setIsUploading(true);
    let successCount = 0;
    
    try {
      for (const file of files) {
        try {
          // 1. Compress Image (Strictly to fit in Firestore 1MB limit)
          let fileToUpload: File | Blob = file;
          try {
            const options = {
              maxSizeMB: 0.6, // 600KB max to safely fit in 1MB after Base64 encoding
              maxWidthOrHeight: 1600,
              useWebWorker: true,
            };
            fileToUpload = await imageCompression(file, options);
          } catch (compressionError) {
            console.warn("Image compression failed:", compressionError);
            if (file.size > 700 * 1024) {
              throw new Error("Slika je prevelika in je ni bilo mogoče stisniti.");
            }
          }

          // 2. Convert to Base64
          const base64String = await fileToBase64(fileToUpload);

          // 3. Save directly to Firestore (bypassing Storage rules/setup)
          await addDoc(collection(db, "events", id, "photos"), {
            url: base64String,
            eventId: id,
            deviceId: deviceId,
            createdAt: serverTimestamp()
          });
          
          successCount++;
        } catch (fileError) {
          console.error("Error uploading a file:", fileError);
        }
      }

      setIsUploading(false);
      
      if (successCount > 0) {
        setUploadSuccess(true);
        setUploadError('');
        // Reset success state after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError("Nobene slike ni bilo mogoče naložiti. Poskusite znova.");
      }
    } catch (error: any) {
      setIsUploading(false);
      const errorMessage = error.message ? `Napaka: ${error.message}` : "Prišlo je do napake pri nalaganju. Poskusite znova.";
      setUploadError(errorMessage);
      console.error("Upload error:", error);
    }
    
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleDownloadAll = async () => {
    if (!id || !event) return;
    setIsDownloadingAll(true);
    try {
      const q = query(collection(db, "events", id, "photos"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const allPhotos = querySnapshot.docs.map(doc => doc.data());

      if (allPhotos.length === 0) {
        alert("Ni še naloženih fotografij.");
        setIsDownloadingAll(false);
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder(`Kliksy-${event.partner1}-${event.partner2}`);
      
      if (!folder) throw new Error("Could not create zip folder");

      const promises = allPhotos.map(async (photo, index) => {
        try {
          const response = await fetch(photo.url);
          const blob = await response.blob();
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
    } catch (error) {
      console.error("Error creating zip file:", error);
      alert("Prišlo je do napake pri prenosu. Poskusite znova.");
    } finally {
      setIsDownloadingAll(false);
    }
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
        accept="image/*" 
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.partner1} & {event.partner2}</h1>
        <p className="text-gray-500 text-sm">Hvala, ker deliš spomine z nama.</p>
      </header>

      {/* Main Actions */}
      <main className="flex-1 px-6 py-8 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
              <h3 className="text-xl font-bold text-gray-900">Nalagam spomin...</h3>
              <p className="text-sm text-gray-500 mt-2">Prosimo, počakaj trenutek.</p>
            </motion.div>
          ) : uploadSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Uspešno naloženo!</h3>
              <p className="text-gray-600 mb-8">Tvoja slika je dodana v galerijo.</p>
              
              <button 
                onClick={() => setUploadSuccess(false)}
                className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors"
              >
                <Plus className="w-5 h-5" /> Dodaj še eno
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-4"
            >
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
          )}
        </AnimatePresence>

        {/* Live Feed Preview */}
        {!isUploading && !uploadSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full mt-12"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-lg text-gray-900">Zadnji spomini</h3>
              <span className="text-xs font-medium bg-indigo-50 px-2 py-1 rounded-full text-indigo-600">V živo</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {recentPhotos.map((photo, index) => (
                <motion.div 
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={photo.url} alt="Wedding moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.div>
              ))}
              {recentPhotos.length === 0 && (
                <div className="col-span-3 py-8 text-center text-sm text-gray-500">
                  Bodi prvi, ki naloži fotografijo!
                </div>
              )}
            </div>
            {recentPhotos.length > 0 && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleDownloadAll}
                  disabled={isDownloadingAll}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isDownloadingAll ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {isDownloadingAll ? "Pripravljam ZIP..." : "Prenesi vse slike"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Fullscreen Image Modal */}
      {selectedImageIndex !== null && (
        <ImageViewer
          images={recentPhotos}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
        />
      )}
    </div>
  );
}
