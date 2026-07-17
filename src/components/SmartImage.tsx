import React, { useState, useEffect } from 'react';

export const SmartImage = ({ src, alt, className }: any) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isHeic = src && (
      src.toLowerCase().includes('.heic') ||
      src.toLowerCase().includes('%2Fheic') ||
      src.toLowerCase().includes('heic%2F')
    );

    if (isHeic) {
      setLoading(true);
      const convertHeic = async () => {
        try {
          const response = await fetch(src);
          const blob = await response.blob();
          const heic2anyModule = await import('heic2any');
          const heic2any = heic2anyModule.default || heic2anyModule;
          const converted = await heic2any({
            blob,
            toType: 'image/jpeg',
            quality: 0.8
          });
          const url = URL.createObjectURL(
            Array.isArray(converted) ? converted[0] : converted
          );
          setImageSrc(url);
        } catch (err) {
          console.error('HEIC failed:', err);
        } finally {
          setLoading(false);
        }
      };
      convertHeic();
    } else {
      setImageSrc(src);
    }
  }, [src]);

  if (loading) return <div style={{background:'#1a1a2e', aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'12px'}}>Nalagam...</div>;

  return <img src={imageSrc} alt={alt} className={className} />;
};

export default SmartImage;
