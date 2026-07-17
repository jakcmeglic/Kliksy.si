import React, { useState, useEffect, forwardRef } from 'react';
import { loadHeic2Any } from '../heicLoader';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const SmartImage = forwardRef<HTMLImageElement, SmartImageProps>(
  ({ src, alt, className, ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
      if (!src) return;
      
      const isHeic = src.toLowerCase().includes('.heic') || src.toLowerCase().includes('.heif');
      
      if (isHeic) {
        let isMounted = true;
        const fetchUrl = src.includes('firebasestorage.googleapis.com') ? `/api/proxy-image?url=${encodeURIComponent(src)}&raw=1` : src;
        
        loadHeic2Any()
          .then(heic2anyFn => fetch(fetchUrl))
          .then(res => {
             if (!res.ok) throw new Error("Failed to fetch image");
             return res.blob();
          })
          .then(blob => {
             return loadHeic2Any().then(fn => fn({ blob, toType: 'image/jpeg', quality: 0.5 }));
          })
          .then(conversionResult => {
             if (isMounted) {
               const jpegBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
               setImgSrc(URL.createObjectURL(jpegBlob));
             }
          })
          .catch(err => {
             console.error("Error converting HEIC on the fly:", err);
             if (isMounted) setImgSrc(src); // fallback
          });
          
        return () => { isMounted = false; };
      } else {
        setImgSrc(src);
      }
    }, [src]);

    return <img ref={ref} src={imgSrc} alt={alt} className={className} {...props} />;
  }
);

SmartImage.displayName = 'SmartImage';
