import React, { useState, useEffect, forwardRef } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const SmartImage = forwardRef<HTMLImageElement, SmartImageProps>(
  ({ src, alt, className, ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
      if (!src) return;
      
      const isHeic = src.toLowerCase().includes('.heic') || src.toLowerCase().includes('.heif');
      
      if (isHeic && src.includes('firebasestorage.googleapis.com')) {
        setImgSrc(`/api/proxy-image?url=${encodeURIComponent(src)}`);
      } else {
        setImgSrc(src);
      }
    }, [src]);

    return <img ref={ref} src={imgSrc} alt={alt} className={className} {...props} />;
  }
);

SmartImage.displayName = 'SmartImage';
