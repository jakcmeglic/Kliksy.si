export const loadHeic2Any = async (): Promise<any> => {
  if ((window as any).heic2any) return (window as any).heic2any;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
    script.onload = () => resolve((window as any).heic2any);
    script.onerror = () => reject(new Error('Failed to load heic2any script'));
    document.head.appendChild(script);
  });
};
