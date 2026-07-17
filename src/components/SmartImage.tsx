import React, { useState, useEffect, useRef } from 'react';

const heicCache = new Map();

export const SmartImage = ({ src, alt, className, ...props }: any) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    const isHeic = src && (
      src.toLowerCase().includes('.heic') ||
      src.toLowerCase().includes('%2Fheic') ||
      src.toLowerCase().includes('heic%2F')
    );

    if (!isHeic) {
      setImageSrc(src);
      return;
    }

    if (heicCache.has(src)) {
      setImageSrc(heicCache.get(src));
      return;
    }

    setLoading(true);

    const convertHeic = async () => {
      if (heicCache.has(src)) {
        if (isMounted) {
          setImageSrc(heicCache.get(src));
          setLoading(false);
        }
        return;
      }
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const heic2anyModule = await import('heic2any');
        const heic2any = heic2anyModule.default || heic2anyModule;
        const converted = await heic2any({
          blob,
          toType: 'image/jpeg',
          quality: 0.7
        });
        const url = URL.createObjectURL(
          Array.isArray(converted) ? converted[0] : converted
        );
        heicCache.set(src, url);
        if (isMounted) {
          setImageSrc(url);
        }
      } catch (err) {
        console.error('HEIC failed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          convertHeic();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [src]);

  if (loading || (!imageSrc && src && (src.toLowerCase().includes('.heic') || src.toLowerCase().includes('%2Fheic') || src.toLowerCase().includes('heic%2F')))) {
    return (
      <div 
        ref={elementRef} 
        className={className} 
        style={{background:'#1a1a2e', aspectRatio: '1', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'12px'}}
        {...props}
      >
        Nalagam...
      </div>
    );
  }

  return <img ref={elementRef} src={imageSrc || src} alt={alt} className={className} {...props} />;
};

export default SmartImage;
