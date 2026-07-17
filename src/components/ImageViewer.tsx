import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, Trash2 } from 'lucide-react';
import { SmartImage } from './SmartImage';

const MotionSmartImage = motion.create ? motion.create(SmartImage) : (motion as any)(SmartImage);

  interface ImageViewerProps {
  images: { id: string; url: string; likes?: number; likedBy?: string[]; type?: string }[];
  initialIndex: number;
  onClose: () => void;
  onToggleLike?: (photoId: string) => void;
  onDelete?: (photoId: string) => void;
  currentUserId?: string;
}

export default function ImageViewer({ images, initialIndex, onClose, onToggleLike, onDelete, currentUserId }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Create a local optimistic state for likes to make the UI feel responsive
  const [optimisticLiked, setOptimisticLiked] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images || images.length === 0) return null;
  
  const currentImage = images[currentIndex];
  // Determine if it's liked by looking at the optimistic state first, then the actual data
  const isLikedOptimistically = optimisticLiked[currentImage.id];
  const isLikedInData = currentUserId ? currentImage.likedBy?.includes(currentUserId) : false;
  // We consider it liked if either is true (optimistic applies immediately, data catches up)
  const isLiked = isLikedOptimistically !== undefined ? isLikedOptimistically : isLikedInData;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleLike || !currentUserId) return;
    
    // Toggle optimistic state
    setOptimisticLiked(prev => ({
      ...prev,
      [currentImage.id]: !isLiked
    }));
    
    onToggleLike(currentImage.id);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <button 
          className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 bg-black/50 w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 hover:text-white transition-all z-50"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-6 h-6" />
        </button>

        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/70 bg-black/50 w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 hover:text-white transition-all z-50"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/70 bg-black/50 w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 hover:text-white transition-all z-50"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12" onClick={handleNext}>
          {currentImage.type === 'video' ? (
            <motion.video
              key={`vid-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={currentImage.url}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e: React.MouseEvent<HTMLVideoElement>) => e.stopPropagation()}
            />
          ) : (
            <MotionSmartImage
              key={`img-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={currentImage.url}
              alt="Gallery image"
              className="max-w-full max-h-full object-contain select-none"
              referrerPolicy="no-referrer"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
          )}
          
          {/* Like button and counter at bottom */}
          <div 
            className="absolute bottom-20 flex items-end justify-center gap-6" 
            onClick={(e) => e.stopPropagation()}
          >
            {onToggleLike && currentUserId && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleLikeClick}
                  className="w-16 h-16 rounded-full bg-black/60 shadow-lg flex items-center justify-center backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95 transition-all"
                >
                  <Heart 
                    className={`w-8 h-8 transition-colors ${
                      isLiked 
                        ? "text-red-500 fill-red-500 scale-110" 
                        : "text-white"
                    }`} 
                  />
                </button>
                {/* Adjust like count optimally: if previously unliked and now liked -> add 1. If previously liked and now unliked -> sub 1 */}
                {(currentImage.likes !== undefined && currentImage.likes > 0) || (isLiked && !isLikedInData) ? (
                  <span className="text-white/90 font-medium text-lg drop-shadow-md">
                    {isLiked && !isLikedInData 
                      ? (currentImage.likes || 0) + 1 
                      : !isLiked && isLikedInData 
                        ? Math.max(0, (currentImage.likes || 1) - 1)
                        : (currentImage.likes || 0)}
                  </span>
                ) : null}
              </div>
            )}
            
            {onDelete && (
              <div className="flex flex-col items-center gap-2 pb-[34px]">
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(currentImage.id);
                    if (images.length <= 1) {
                      onClose();
                    } else if (currentIndex >= images.length - 1) {
                      setCurrentIndex(images.length - 2);
                    }
                  }}
                  className="w-16 h-16 rounded-full bg-red-500/80 shadow-lg flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-red-600 hover:scale-110 active:scale-95 transition-all"
                >
                  <Trash2 className="w-8 h-8 text-white transition-colors" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
