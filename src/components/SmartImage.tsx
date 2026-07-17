import React, { useState, useEffect, forwardRef } from 'react';
import heic2any from 'heic2any';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const SmartImage = forwardRef<HTMLImageElement, SmartImageProps>(
  ({ src, alt, className, ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
      if (!src) return;
      
      // Check if the URL might be a HEIC file
      const isHeic = src.toLowerCase().includes('.heic') || src.toLowerCase().includes('.heif');
      
      if (isHeic) {
        let isMounted = true;
        fetch(src)
          .then(res => res.blob())
          .then(blob => heic2any({ blob, toType: 'image/jpeg', quality: 0.5 }))
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
