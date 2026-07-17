import React, { forwardRef } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const SmartImage = forwardRef<HTMLImageElement, SmartImageProps>(
  ({ src, alt, className, ...props }, ref) => {
    const handleImageError = async (e: any, imageUrl: string) => {
      if (imageUrl.toLowerCase().includes('.heic') || imageUrl.toLowerCase().includes('heic')) {
        try {
          const fetchUrl = imageUrl.includes('firebasestorage.googleapis.com') ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}&raw=1` : imageUrl;
          const response = await fetch(fetchUrl);
          const blob = await response.blob();
          const heic2anyModule = await import('heic2any');
          const heic2any = heic2anyModule.default || heic2anyModule;
          const convertedBlob = await (heic2any as any)({
            blob: blob,
            toType: 'image/jpeg',
            quality: 0.8
          });
          const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          const objectUrl = URL.createObjectURL(finalBlob);
          e.target.src = objectUrl;
        } catch (err) {
          console.error('HEIC conversion failed:', err);
        }
      }
    };

    return <img ref={ref} src={src} alt={alt} className={className} onError={(e) => handleImageError(e, src)} {...props} />;
  }
);

SmartImage.displayName = 'SmartImage';
