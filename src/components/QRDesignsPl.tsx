import React from 'react';

export type DesignProps = {
  event: any;
  eventUrl: string;
  QRCodeComponent: any;
  qrSize: number;
  isPrint: boolean;
};

// --- SVG HELPERS ---

export const CameraIcon = ({ className, color }: { className?: string, color: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

export const GoldLinesBg = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
    <line x1="0" y1="10%" x2="100%" y2="10%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
    <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
    <line x1="0" y1="90%" x2="100%" y2="90%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
    <circle cx="10%" cy="10%" r="1.5" fill="#D4AF37" opacity="0.8" />
    <circle cx="90%" cy="10%" r="1.5" fill="#D4AF37" opacity="0.8" />
    <circle cx="10%" cy="90%" r="1.5" fill="#D4AF37" opacity="0.8" />
    <circle cx="90%" cy="90%" r="1.5" fill="#D4AF37" opacity="0.8" />
  </svg>
);

export const LeafFrame = ({ children, isPrint }: { children: React.ReactNode, isPrint: boolean }) => (
  <div className="relative">
    <svg className={`absolute ${isPrint ? '-top-8 -left-8 w-24 h-24' : '-top-4 -left-4 w-12 h-12'} pointer-events-none`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 40 Q 10 10 40 10" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
      <path d="M10 30 Q 0 20 10 10 Q 20 20 10 30" fill="#D4AF37" opacity="0.4" />
      <path d="M20 40 Q 30 50 40 40 Q 30 30 20 40" fill="#D4AF37" opacity="0.4" />
      <path d="M15 25 Q 5 15 15 5 Q 25 15 15 25" fill="#D4AF37" opacity="0.2" />
    </svg>
    <svg className={`absolute ${isPrint ? '-bottom-8 -right-8 w-24 h-24' : '-bottom-4 -right-4 w-12 h-12'} pointer-events-none`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
      <path d="M10 40 Q 10 10 40 10" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
      <path d="M10 30 Q 0 20 10 10 Q 20 20 10 30" fill="#D4AF37" opacity="0.4" />
      <path d="M20 40 Q 30 50 40 40 Q 30 30 20 40" fill="#D4AF37" opacity="0.4" />
      <path d="M15 25 Q 5 15 15 5 Q 25 15 15 25" fill="#D4AF37" opacity="0.2" />
    </svg>
    <div className={`border-[1px] border-[#D4AF37] ${isPrint ? 'p-4' : 'p-2'} bg-white relative z-10`}>
      {children}
    </div>
  </div>
);

export const FloralCornerTopRight = () => (
  <svg className="absolute top-0 right-0 w-full h-full pointer-events-none" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMin slice">
    <g opacity="0.8">
      <circle cx="350" cy="50" r="80" fill="#FBCFE8" opacity="0.15" />
      <circle cx="400" cy="150" r="60" fill="#FDE68A" opacity="0.1" />
      <circle cx="280" cy="-20" r="70" fill="#A7F3D0" opacity="0.1" />
      
      <path d="M280 50 Q 250 80 260 120 Q 300 100 280 50" fill="#86EFAC" opacity="0.6" />
      <path d="M350 150 Q 330 190 370 210 Q 390 170 350 150" fill="#86EFAC" opacity="0.6" />
      <path d="M320 20 Q 290 10 280 40 Q 310 50 320 20" fill="#86EFAC" opacity="0.6" />
      
      <circle cx="340" cy="80" r="30" fill="#F9A8D4" opacity="0.7" />
      <path d="M340 80 Q 320 60 340 50 Q 360 60 340 80" fill="#F472B6" opacity="0.8" />
      <path d="M340 80 Q 360 100 370 80 Q 360 60 340 80" fill="#F472B6" opacity="0.8" />
      <path d="M340 80 Q 320 100 310 80 Q 320 60 340 80" fill="#F472B6" opacity="0.8" />
      
      <circle cx="380" cy="30" r="20" fill="#FCD34D" opacity="0.7" />
      
      <path d="M250 100 Q 220 90 200 120" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <path d="M300 180 Q 280 210 250 200" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <path d="M380 220 Q 370 250 340 260" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
    </g>
  </svg>
);

export const FloralCornerBottomLeft = () => (
  <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMax slice">
    <g opacity="0.8">
      <circle cx="50" cy="550" r="80" fill="#FBCFE8" opacity="0.15" />
      <circle cx="0" cy="450" r="60" fill="#FDE68A" opacity="0.1" />
      <circle cx="120" cy="620" r="70" fill="#A7F3D0" opacity="0.1" />
      
      <path d="M120 550 Q 150 520 140 480 Q 100 500 120 550" fill="#86EFAC" opacity="0.6" />
      <path d="M50 450 Q 70 410 30 390 Q 10 430 50 450" fill="#86EFAC" opacity="0.6" />
      
      <circle cx="60" cy="520" r="30" fill="#F9A8D4" opacity="0.7" />
      <path d="M60 520 Q 80 540 60 550 Q 40 540 60 520" fill="#F472B6" opacity="0.8" />
      <path d="M60 520 Q 40 500 30 520 Q 40 540 60 520" fill="#F472B6" opacity="0.8" />
      <path d="M60 520 Q 80 500 90 520 Q 80 540 60 520" fill="#F472B6" opacity="0.8" />
      
      <circle cx="20" cy="570" r="20" fill="#FCD34D" opacity="0.7" />
      
      <path d="M150 500 Q 180 510 200 480" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <path d="M100 420 Q 120 390 150 400" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <path d="M20 380 Q 30 350 60 340" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
    </g>
  </svg>
);

export const GeometricGoldBgFull = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M0 150 L 200 0 L 400 100 L 350 600 L 0 450 Z" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" fill="none" />
    <path d="M-50 350 L 250 150 L 450 450 L 150 750 Z" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" fill="none" />
    <path d="M100 -50 L 450 250 L 300 650 L -100 300 Z" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" fill="none" />
    
    <path d="M50 450 Q 80 400 100 450 Q 70 480 50 450" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.8" />
    <path d="M40 470 Q 70 420 90 470 Q 60 500 40 470" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.6" />
    <path d="M60 490 Q 90 440 110 490 Q 80 520 60 490" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.4" />
    <path d="M20 520 Q 100 450 150 600" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.8" />
    
    <path d="M350 150 Q 320 200 300 150 Q 330 120 350 150" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.8" />
    <path d="M360 130 Q 330 180 310 130 Q 340 100 360 130" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.6" />
    <path d="M340 110 Q 310 160 290 110 Q 320 80 340 110" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.4" />
    <path d="M380 80 Q 300 150 250 0" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.8" />
  </svg>
);

export const NestedGoldSquares = ({ children, isPrint }: { children: React.ReactNode, isPrint: boolean }) => (
  <div className="relative">
    <div className={`absolute ${isPrint ? '-inset-3' : '-inset-1.5'} border-[1px] border-[#D4AF37] rotate-3 pointer-events-none opacity-70`}></div>
    <div className={`absolute ${isPrint ? '-inset-3' : '-inset-1.5'} border-[1px] border-[#D4AF37] -rotate-2 pointer-events-none opacity-70`}></div>
    <div className={`border-[1px] border-[#D4AF37] ${isPrint ? 'p-4' : 'p-2'} bg-white relative z-10`}>
      {children}
    </div>
  </div>
);

export const Confetti = ({ className }: { className?: string }) => (
  <svg className={className} width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="30" r="4" fill="#F87171" />
    <rect x="150" y="20" width="8" height="8" transform="rotate(45 150 20)" fill="#60A5FA" />
    <circle cx="180" cy="150" r="5" fill="#FBBF24" />
    <rect x="40" y="160" width="6" height="12" transform="rotate(30 40 160)" fill="#34D399" />
    <circle cx="100" cy="80" r="3" fill="#A78BFA" />
    <rect x="120" y="180" width="10" height="4" transform="rotate(-20 120 180)" fill="#F472B6" />
    <circle cx="170" cy="80" r="6" fill="#34D399" />
    <rect x="30" y="100" width="8" height="8" transform="rotate(15 30 100)" fill="#FBBF24" />
  </svg>
);

export const ComicRays = ({ className, color }: { className?: string, color: string }) => (
  <svg className={className} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,50 0,0 20,0" fill={color} opacity="0.1" />
    <polygon points="50,50 40,0 60,0" fill={color} opacity="0.1" />
    <polygon points="50,50 80,0 100,0" fill={color} opacity="0.1" />
    <polygon points="50,50 100,20 100,40" fill={color} opacity="0.1" />
    <polygon points="50,50 100,60 100,80" fill={color} opacity="0.1" />
    <polygon points="50,50 100,100 80,100" fill={color} opacity="0.1" />
    <polygon points="50,50 60,100 40,100" fill={color} opacity="0.1" />
    <polygon points="50,50 20,100 0,100" fill={color} opacity="0.1" />
    <polygon points="50,50 0,80 0,60" fill={color} opacity="0.1" />
    <polygon points="50,50 0,40 0,20" fill={color} opacity="0.1" />
  </svg>
);

const getEventTitle = (event: any) => {
  if (event.eventType === 'poroka') return `${event.partner1 || 'Partner 1'} & ${event.partner2 || 'Partner 2'}`;
  return event.eventName || 'Wydarzenie';
};

const WeddingTextContent = ({ event, isPrint }: { event: any, isPrint: boolean }) => {
  const title = getEventTitle(event);
  const dateStr = event.date ? new Date(event.date).toLocaleDateString('pl-PL') : '';
  
  return (
    <div className="flex flex-col items-center mb-4 z-10 relative">
      <h1 className={`font-serif italic text-[#9A7B4F] ${isPrint ? 'text-5xl' : 'text-2xl'} leading-tight text-center`}>
        Uchwyć nasze<br/>najpiękniejsze chwile <CameraIcon className={`inline-block ${isPrint ? 'w-10 h-10' : 'w-6 h-6'} ml-1 -mt-2`} color="#9A7B4F" />
      </h1>
      <div className={`text-center ${isPrint ? 'mt-8' : 'mt-4'}`}>
        <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-xl' : 'text-xs'} uppercase tracking-widest font-medium`}>{title}</p>
        <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-lg' : 'text-[10px]'} uppercase tracking-widest mt-1`}>{dateStr}</p>
      </div>
    </div>
  );
};

const WeddingFooterContent = ({ isPrint }: { isPrint: boolean }) => (
  <div className={`flex flex-col items-center text-center z-10 relative ${isPrint ? 'mt-8' : 'mt-4'}`}>
    <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-xl' : 'text-xs'} mb-2`}>Zeskanuj mnie</p>
    <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-lg' : 'text-[10px]'} leading-relaxed`}>
      Dodaj swoje zdjęcia i<br/>zobacz wspomnienia z tego dnia.
    </p>
    <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-lg' : 'text-[10px]'} ${isPrint ? 'mt-6' : 'mt-3'}`}>
      Dziękujemy za stworzenie z nami wspomnień ✨
    </p>
    <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-sm' : 'text-[8px]'} ${isPrint ? 'mt-8' : 'mt-4'} opacity-70`}>
      kliksy.pl
    </p>
  </div>
);

// --- DESIGNS ---

export const DESIGNS = [
  // ==========================================
  // VJENČANI DIZAJNI (Po inspiraciji)
  // ==========================================
  {
    id: 'w1', category: 'Ślubne', name: 'Złote linie', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-[#FAFAFA] overflow-hidden">
          <GoldLinesBg />
          <WeddingTextContent event={event} isPrint={isPrint} />
          
          <LeafFrame isPrint={isPrint}>
            <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </LeafFrame>
          
          <WeddingFooterContent isPrint={isPrint} />
        </div>
      );
    }
  },
  {
    id: 'w2', category: 'Ślubne', name: 'Kwiatowa romantyka', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-gradient-to-br from-[#FFF0F0] via-[#FFE4E1] to-[#FFF0F5] overflow-hidden">
          <FloralCornerTopRight />
          <FloralCornerBottomLeft />
          
          <WeddingTextContent event={event} isPrint={isPrint} />
          
          <div className={`border-[1px] border-[#D4AF37] ${isPrint ? 'p-4' : 'p-2'} bg-white relative z-10 shadow-sm`}>
            <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <WeddingFooterContent isPrint={isPrint} />
        </div>
      );
    }
  },
  {
    id: 'w3', category: 'Ślubne', name: 'Geometryczna elegancja', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-[#F5F0EA] overflow-hidden">
          <GeometricGoldBgFull />
          
          <WeddingTextContent event={event} isPrint={isPrint} />
          
          <NestedGoldSquares isPrint={isPrint}>
            <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </NestedGoldSquares>
          
          <WeddingFooterContent isPrint={isPrint} />
        </div>
      );
    }
  },

  {
    id: 'w5', category: 'Ślubne', name: 'Luksus: Królewski błękit', bg: '#0f172a',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
      const date = new Date(event.date).toLocaleDateString('pl-PL');
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-slate-900 border-8 border-slate-800 overflow-hidden">
          <div className="w-full flex flex-col items-center mt-4">
            <h1 className={`font-serif text-yellow-500 font-bold ${isPrint ? 'text-5xl' : 'text-2xl'}`}>{title}</h1>
            <p className={`font-sans text-slate-300 tracking-widest uppercase ${isPrint ? 'text-xl mt-4' : 'text-xs mt-2'}`}>{date}</p>
          </div>
          <div className="flex flex-col items-center my-6">
            <p className={`font-serif text-yellow-400 italic mb-6 ${isPrint ? 'text-2xl px-12' : 'text-sm px-4'}`}>"Uchwyć chwilę. Zeskanuj i podziel się z nami swoimi zdjęciami."</p>
            <div className={`p-4 bg-white rounded-xl shadow-2xl ring-4 ring-yellow-500/30`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#0f172a" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className="mb-4">
            <p className={`font-sans text-slate-300 uppercase tracking-widest ${isPrint ? 'text-lg' : 'text-[10px]'}`}>Dziękujemy, że dzielisz z nami ten dzień</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'w6', category: 'Ślubne', name: 'Luksus: Szmaragdowa elegancja', bg: '#064e3b',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
      const date = new Date(event.date).toLocaleDateString('pl-PL');
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-emerald-900 overflow-hidden">
          <div className="absolute inset-4 border-[1px] border-emerald-700/50 pointer-events-none"></div>
          <div className="absolute inset-6 border-[1px] border-emerald-600/30 pointer-events-none"></div>
          <div className="w-full flex flex-col items-center mt-8 z-10">
            <h1 className={`font-serif text-emerald-50 font-light tracking-wide ${isPrint ? 'text-5xl' : 'text-2xl'}`}>{title}</h1>
            <div className={`h-px bg-emerald-700 w-24 ${isPrint ? 'my-6' : 'my-3'}`}></div>
            <p className={`font-sans text-emerald-200 tracking-[0.3em] uppercase ${isPrint ? 'text-lg' : 'text-[10px]'}`}>{date}</p>
          </div>
          <div className="flex flex-col items-center z-10">
            <p className={`font-sans font-light text-white mb-6 ${isPrint ? 'text-xl px-12' : 'text-xs px-4'}`}>Bądź naszym fotografem! Podziel się swoimi chwilami za pomocą kodu QR.</p>
            <div className={`p-3 bg-emerald-50 rounded-sm shadow-xl`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#f8fafc" fgColor="#064e3b" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className="mb-8 z-10">
            <CameraIcon className={`${isPrint ? 'w-8 h-8' : 'w-4 h-4'} mx-auto text-emerald-300 opacity-80`} color="currentColor" />
          </div>
        </div>
      );
    }
  },
  {
    id: 'w7', category: 'Ślubne', name: 'Luksus: Aksamitna róża', bg: '#4c0519',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
      const date = new Date(event.date).toLocaleDateString('pl-PL');
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-rose-950 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-900/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-rose-900/50 to-transparent"></div>
          <div className="w-full flex flex-col items-center mt-6 z-10">
            <p className={`font-serif text-rose-200 italic ${isPrint ? 'text-2xl mb-4' : 'text-xs mb-2'}`}>Witamy na naszym weselu</p>
            <h1 className={`font-serif text-white font-medium ${isPrint ? 'text-5xl' : 'text-2xl'}`}>{title}</h1>
          </div>
          <div className="flex flex-col items-center z-10">
            <div className={`p-4 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl mb-6`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#4c0519" level="Q" includeMargin={false} />
            </div>
            <p className={`font-sans text-rose-100 font-light ${isPrint ? 'text-xl px-12' : 'text-xs px-4'}`}>Nasz dzień Twoimi oczami. Zrób zdjęcie i prześlij tutaj.</p>
          </div>
          <div className="mb-6 z-10">
            <p className={`font-sans text-rose-200 tracking-widest uppercase ${isPrint ? 'text-lg' : 'text-[10px]'}`}>{date}</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'w8', category: 'Ślubne', name: 'Boho: Terakota', bg: '#fff7ed',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
      const date = new Date(event.date).toLocaleDateString('pl-PL');
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-orange-50 overflow-hidden">
          <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 Q50,20 100,0 L100,100 Q50,80 0,100 Z" fill="#c2410c" />
          </svg>
          <div className={`w-full flex flex-col items-center ${isPrint ? 'mt-4' : 'mt-8'} z-10`}>
            <h1 className={`font-serif text-orange-900 font-bold ${isPrint ? 'text-5xl' : 'text-2xl'}`}>{title}</h1>
            <p className={`font-sans text-orange-700 tracking-wider uppercase ${isPrint ? 'text-lg mt-4' : 'text-[10px] mt-2'}`}>{date}</p>
          </div>
          <div className={`flex flex-col items-center z-10 bg-white/60 ${isPrint ? 'p-4' : 'p-6'} rounded-3xl backdrop-blur-sm border border-orange-200/50 shadow-xl`}>
            <p className={`font-serif text-orange-800 italic ${isPrint ? 'mb-4 text-2xl px-4' : 'mb-6 text-xs px-2'}`}>Stwórzmy razem wspomnienia.<br/>Zeskanuj, aby udostępnić zdjęcia.</p>
            <div className={`p-2 bg-white rounded-xl`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#9a3412" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className={`${isPrint ? 'mb-4' : 'mb-8'} z-10`}>
            <span className={`inline-block w-12 h-1 bg-orange-300 rounded-full`}></span>
          </div>
        </div>
      );
    }
  },
  {
    id: 'w9', category: 'Ślubne', name: 'Boho: Szałwia', bg: '#f0fdf4',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
      const date = new Date(event.date).toLocaleDateString('pl-PL');
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-green-50 overflow-hidden">
          <div className="absolute inset-0 border-[12px] border-green-100/50 rounded-3xl m-4 pointer-events-none"></div>
          <div className="w-full flex flex-col items-center mt-10 z-10">
            <h1 className={`font-serif text-green-900 font-medium ${isPrint ? 'text-4xl' : 'text-xl'}`}>{title}</h1>
            <p className={`font-sans text-green-700 tracking-widest uppercase ${isPrint ? 'text-md mt-3' : 'text-[9px] mt-1'}`}>{date}</p>
          </div>
          <div className="flex flex-col items-center z-10">
            <div className={`p-3 bg-white rounded-2xl shadow-lg border border-green-100 mb-5`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#14532d" level="Q" includeMargin={false} />
            </div>
            <p className={`font-sans text-green-800 font-medium ${isPrint ? 'text-xl px-10' : 'text-[11px] px-4'}`}>Dziel się miłością, dziel się zdjęciami!<br/>Zeskanuj kod QR.</p>
          </div>
          <div className="mb-10 z-10">
            <svg className={`${isPrint ? 'w-10 h-10' : 'w-5 h-5'} text-green-300`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      );
    }
  },
  {
    id: 'w10', category: 'Ślubne', name: 'Boho: Ciepły piasek', bg: '#fefce8',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
      const date = new Date(event.date).toLocaleDateString('pl-PL');
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-yellow-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-yellow-600"></div>
          <div className="w-full flex flex-col items-center mt-8 z-10 bg-white/80 py-4 px-8 rounded-full shadow-sm backdrop-blur-sm">
            <h1 className={`font-serif text-yellow-900 font-bold ${isPrint ? 'text-4xl' : 'text-xl'}`}>{title}</h1>
          </div>
          <div className="flex flex-col items-center z-10 mt-4">
            <p className={`font-sans text-yellow-800 font-medium mb-6 ${isPrint ? 'text-2xl px-10' : 'text-xs px-2'}`}>Twój widok na nasz dzień.<br/>Prześlij zdjęcia tutaj.</p>
            <div className={`p-4 bg-white rounded-full shadow-xl border-4 border-yellow-100`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#713f12" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className="mb-8 z-10 bg-white/80 py-2 px-6 rounded-full shadow-sm backdrop-blur-sm">
            <p className={`font-sans text-yellow-800 tracking-widest uppercase ${isPrint ? 'text-lg' : 'text-[10px]'}`}>{date}</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'w11', category: 'Ślubne', name: 'Neutralne: Czysty minimalizm', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
      const date = new Date(event.date).toLocaleDateString('pl-PL');
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-white overflow-hidden border-[1px] border-gray-100">
          <div className="w-full flex flex-col items-center mt-12 z-10">
            <h1 className={`font-sans text-gray-900 font-light tracking-tight ${isPrint ? 'text-5xl' : 'text-2xl'}`}>{title}</h1>
            <p className={`font-sans text-gray-400 tracking-[0.2em] uppercase ${isPrint ? 'text-sm mt-4' : 'text-[8px] mt-2'}`}>{date}</p>
          </div>
          <div className="flex flex-col items-center z-10">
            <div className={`p-1`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.2} bgColor="#ffffff" fgColor="#000000" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className="mb-12 z-10">
            <p className={`font-sans text-gray-600 font-light ${isPrint ? 'text-xl px-12' : 'text-xs px-4'}`}>Pomóż nam uchwycić każdy uśmiech.<br/>Zeskanuj i podziel się.</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'w12', category: 'Ślubne', name: 'Neutralne: Delikatna szarość', bg: '#f9fafb',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
      const date = new Date(event.date).toLocaleDateString('pl-PL');
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-gray-50 overflow-hidden">
          <div className="absolute inset-6 border-[1px] border-gray-200 rounded-2xl pointer-events-none"></div>
          <div className="w-full flex flex-col items-center mt-10 z-10">
            <p className={`font-serif text-gray-500 italic ${isPrint ? 'text-xl mb-4' : 'text-[10px] mb-2'}`}>Świętuj z nami</p>
            <h1 className={`font-serif text-gray-800 font-medium ${isPrint ? 'text-4xl' : 'text-xl'}`}>{title}</h1>
          </div>
          <div className="flex flex-col items-center z-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#1f2937" level="Q" includeMargin={false} />
            <p className={`font-sans text-gray-600 mt-4 ${isPrint ? 'text-lg' : 'text-[10px]'}`}>Zrób zdjęcie, zeskanuj, podziel się!<br/>Dziękujemy, że jesteś z nami.</p>
          </div>
          <div className="mb-10 z-10">
            <p className={`font-sans text-gray-400 tracking-widest uppercase ${isPrint ? 'text-md' : 'text-[9px]'}`}>{date}</p>
          </div>
        </div>
      );
    }
  },

  // ==========================================
  // NEUTRALNI DIZAJNI
  // ==========================================
  {
    id: 'n1', category: 'Uniwersalne', name: 'Czysty minimalizm', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-white">
          <h1 className={`font-sans text-gray-900 ${isPrint ? 'text-3xl mb-10' : 'text-lg mb-6'} font-bold uppercase tracking-[0.3em]`}>
            Podziel się z nami zdjęciami
          </h1>
          
          <div className={`p-2 bg-white mb-10`}>
            <QRCodeComponent value={eventUrl} size={qrSize * 1.2} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <p className={`font-sans text-gray-500 ${isPrint ? 'text-xl' : 'text-xs'} uppercase tracking-widest`}>
            {event.eventName}
          </p>
        </div>
      );
    }
  },
  {
    id: 'n2', category: 'Uniwersalne', name: 'Elegancja', bg: '#F9FAFB',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-10 text-center z-10 bg-gray-50 border border-gray-200">
          <h1 className={`font-serif text-gray-900 ${isPrint ? 'text-4xl' : 'text-xl'} font-medium`}>
            {event.eventName}
          </h1>
          
          <div className={`p-4 bg-white shadow-sm rounded-xl`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <p className={`font-serif italic text-gray-600 ${isPrint ? 'text-2xl' : 'text-sm'}`}>
            Proszę, podziel się z nami zdjęciami.
          </p>
        </div>
      );
    }
  },
  {
    id: 'n3', category: 'Uniwersalne', name: 'Ramka', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-white">
          <div className="absolute inset-4 border-[6px] border-gray-900 pointer-events-none"></div>
          
          <div className={`p-2 bg-white mb-8`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <h1 className={`font-sans text-gray-900 ${isPrint ? 'text-3xl' : 'text-sm'} font-black uppercase tracking-widest px-4`}>
            Zeskanuj i podziel się z nami zdjęciami
          </h1>
        </div>
      );
    }
  },
  {
    id: 'n4', category: 'Uniwersalne', name: 'Ciemna elegancja', bg: '#111827',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-gray-900">
          <p className={`font-sans text-gray-300 ${isPrint ? 'text-xl mb-8' : 'text-[10px] mb-4'} uppercase tracking-widest`}>
            {event.eventName}
          </p>
          
          <div className={`p-4 bg-white rounded-2xl mb-8`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <h1 className={`font-serif text-white ${isPrint ? 'text-4xl' : 'text-lg'} font-medium`}>
            Podziel się swoimi zdjęciami z nami
          </h1>
        </div>
      );
    }
  },

  // ==========================================
  // POSLOVNI DIZAJNI
  // ==========================================
  {
    id: 'b1', category: 'Firmowe', name: 'Korporacyjne', bg: '#F8FAFC',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-start justify-between p-10 text-left z-10 bg-slate-50">
          <div className="absolute top-0 left-0 w-3 h-full bg-blue-700 pointer-events-none"></div>
          
          <div className="pl-4">
            <h1 className={`font-sans text-slate-900 ${isPrint ? 'text-4xl' : 'text-xl'} font-bold uppercase tracking-wide`}>
              {event.eventName}
            </h1>
          </div>
          
          <div className={`p-4 bg-white border border-slate-200 shadow-sm ml-4`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <div className="pl-4">
            <p className={`font-sans text-blue-700 ${isPrint ? 'text-2xl' : 'text-sm'} font-bold`}>
              Podzielcie się z nami zdjęciami
            </p>
            <p className={`font-sans text-slate-500 ${isPrint ? 'text-sm mt-2' : 'text-[8px] mt-1'}`}>
              Zeskanuj kod, aby przesłać pliki.
            </p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'b2', category: 'Firmowe', name: 'Konferencja', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-white border-4 border-slate-100">
          <h1 className={`font-sans text-slate-800 ${isPrint ? 'text-3xl mb-8' : 'text-sm mb-4'} font-bold uppercase tracking-widest`}>
            Zeskanuj kod i podziel się z nami zdjęciami
          </h1>
          
          <div className={`p-2 bg-white mb-8`}>
            <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <div className="w-16 h-1 bg-slate-300 mb-4"></div>
          <p className={`font-sans text-slate-500 ${isPrint ? 'text-lg' : 'text-[10px]'} uppercase tracking-widest`}>
            {event.eventName}
          </p>
        </div>
      );
    }
  },
  {
    id: 'b3', category: 'Firmowe', name: 'Profesjonalne', bg: '#0F172A',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-10 text-center z-10 bg-slate-900">
          <p className={`font-sans text-slate-300 ${isPrint ? 'text-xl' : 'text-xs'} uppercase tracking-widest font-medium`}>
            {event.eventName}
          </p>
          
          <div className={`p-4 bg-white rounded-xl`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <h1 className={`font-sans text-white ${isPrint ? 'text-3xl' : 'text-sm'} font-light tracking-wide`}>
            Proszę, podzielcie się swoimi zdjęciami z nami.
          </h1>
        </div>
      );
    }
  },
  {
    id: 'b4', category: 'Firmowe', name: 'Wizytówka', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-row items-center justify-between p-8 z-10 bg-white">
          <div className="flex-1 pr-4">
            <h1 className={`font-sans text-slate-900 ${isPrint ? 'text-4xl mb-6' : 'text-xl mb-3'} font-black uppercase leading-tight`}>
              Podzielcie się<br/>zdjęciami<br/>z nami.
            </h1>
            <p className={`font-sans text-slate-500 ${isPrint ? 'text-sm' : 'text-[8px]'} uppercase tracking-widest`}>
              {event.eventName}
            </p>
          </div>
          
          <div className={`p-2 bg-white border-2 border-slate-100 shadow-sm`}>
            <QRCodeComponent value={eventUrl} size={qrSize * 0.9} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
        </div>
      );
    }
  },

  // ==========================================
  // ROĐENDANSKI DIZAJNI
  // ==========================================
  {
    id: 'p1', category: 'Urodzinowe', name: 'Impreza', bg: '#FEF08A',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-yellow-200">
          <Confetti className="absolute inset-0 pointer-events-none" />
          
          <h1 className={`font-sans text-amber-700 ${isPrint ? 'text-5xl mb-8' : 'text-2xl mb-4'} font-black uppercase rotate-[-2deg] z-20`}>
            Podziel się zdjęciami z mojej imprezy!
          </h1>
          
          <div className={`p-4 bg-white rounded-3xl shadow-xl rotate-3 mb-8 z-20`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <p className={`font-sans text-amber-900 ${isPrint ? 'text-2xl' : 'text-sm'} font-bold bg-white/60 px-6 py-2 rounded-full z-20`}>
            {event.eventName}
          </p>
        </div>
      );
    }
  },
  {
    id: 'p2', category: 'Urodzinowe', name: 'Balony', bg: '#DBEAFE',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-blue-100 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-pink-300 rounded-full opacity-60 pointer-events-none"></div>
          <div className="absolute bottom-[-5%] right-[-10%] w-48 h-48 bg-yellow-300 rounded-full opacity-60 pointer-events-none"></div>
          
          <div className="mt-4 z-20">
            <p className={`font-sans text-blue-900 ${isPrint ? 'text-2xl mb-2' : 'text-sm mb-1'} font-bold uppercase tracking-widest`}>
              {event.eventName}
            </p>
            <h1 className={`font-serif italic text-blue-800 ${isPrint ? 'text-5xl' : 'text-2xl'}`}>
              Zrób zdjęcie i podziel się nim ze mną!
            </h1>
          </div>
          
          <div className={`p-4 bg-white rounded-full shadow-lg border-4 border-white z-20 mb-4`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
        </div>
      );
    }
  },
  {
    id: 'p3', category: 'Urodzinowe', name: 'Neon', bg: '#18181B',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-zinc-900">
          <div className="absolute inset-6 border-2 border-pink-500 rounded-2xl opacity-50 pointer-events-none"></div>
          
          <h1 className={`font-sans text-pink-400 ${isPrint ? 'text-5xl mb-10' : 'text-2xl mb-6'} font-black uppercase tracking-widest`} style={{ textShadow: '0 0 10px rgba(236,72,153,0.8)' }}>
            Podziel się zdjęciami<br/>z nami!
          </h1>
          
          <div className={`p-3 bg-white border-2 border-cyan-400 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.5)] mb-10`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <p className={`font-sans text-cyan-300 ${isPrint ? 'text-xl' : 'text-xs'} font-bold uppercase tracking-widest`}>
            {event.eventName}
          </p>
        </div>
      );
    }
  },
  {
    id: 'p4', category: 'Urodzinowe', name: 'Komiks', bg: '#FEF2F2',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-red-50 border-8 border-black">
          <ComicRays className="absolute inset-0 pointer-events-none" color="#EF4444" />
          
          <div className="bg-yellow-300 border-4 border-black p-4 mb-8 transform -rotate-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-20">
            <h1 className={`font-sans text-black ${isPrint ? 'text-4xl' : 'text-xl'} font-black uppercase italic`}>
              BAM! Podziel się zdjęciami<br/>ze mną!
            </h1>
          </div>
          
          <div className={`p-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 z-20`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <p className={`font-sans text-black ${isPrint ? 'text-2xl' : 'text-sm'} font-bold uppercase bg-white px-4 py-1 border-4 border-black z-20`}>
            {event.eventName}
          </p>
        </div>
      );
    }
  },

  // ==========================================
  // POSLOVNI DIZAJNI
  // ==========================================
  {
    id: 'b5', category: 'Firmowe', name: 'Korporacyjny błękit', bg: '#1e3a8a',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventName || 'Wydarzenie firmowe';
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-blue-900 overflow-hidden">
          <div className="w-full flex flex-col items-center mt-8 z-10">
            <h1 className={`font-sans text-white font-bold uppercase tracking-wider ${isPrint ? 'text-4xl' : 'text-xl'}`}>{title}</h1>
            <div className={`h-1 bg-blue-500 w-16 ${isPrint ? 'mt-6' : 'mt-3'}`}></div>
          </div>
          <div className="flex flex-col items-center z-10">
            <p className={`font-sans text-blue-100 font-light mb-6 ${isPrint ? 'text-xl px-12' : 'text-xs px-4'}`}>Zróbcie zdjęcie i podzielcie się nim z nami. Zeskanujcie kod QR.</p>
            <div className={`p-4 bg-white rounded-sm shadow-xl`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#1e3a8a" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className={`absolute bottom-0 w-full flex justify-center ${isPrint ? 'pb-8' : 'pb-4'} z-10`}>
            <p className={`font-sans font-semibold tracking-widest text-blue-200 opacity-80 ${isPrint ? 'text-sm' : 'text-[8px]'}`}>kliksy.pl</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'b7', category: 'Firmowe', name: 'Jasny minimalizm', bg: '#f8fafc',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventName || 'Wydarzenie firmowe';
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-slate-50 overflow-hidden">
          <div className="w-full flex flex-col items-center mt-12 z-10">
            <h1 className={`font-sans text-slate-800 font-bold tracking-tight ${isPrint ? 'text-5xl' : 'text-2xl'}`}>{title}</h1>
          </div>
          <div className="flex flex-col items-center z-10">
            <p className={`font-sans text-slate-600 font-medium mb-6 ${isPrint ? 'text-xl px-8' : 'text-xs px-2'}`}>Twój widok na wydarzenie. Zeskanuj i prześlij zdjęcia.</p>
            <div className={`p-1`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.2} bgColor="#f8fafc" fgColor="#0f172a" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className={`absolute bottom-0 w-full flex justify-center ${isPrint ? 'pb-8' : 'pb-4'} z-10`}>
            <p className={`font-sans font-bold tracking-widest text-slate-300 ${isPrint ? 'text-sm' : 'text-[8px]'}`}>kliksy.pl</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'b8', category: 'Firmowe', name: 'Złote akcenty', bg: '#000000',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventName || 'Wydarzenie firmowe';
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-yellow-600"></div>
          <div className="w-full flex flex-col items-center mt-10 z-10">
            <h1 className={`font-serif text-white font-medium ${isPrint ? 'text-4xl' : 'text-xl'}`}>{title}</h1>
            <p className={`font-sans text-yellow-400 uppercase tracking-widest ${isPrint ? 'text-sm mt-4' : 'text-[8px] mt-2'}`}>Oficjalna galeria</p>
          </div>
          <div className="flex flex-col items-center z-10">
            <div className={`p-4 bg-white rounded-sm shadow-[0_0_15px_rgba(202,138,4,0.3)] mb-6`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#000000" level="Q" includeMargin={false} />
            </div>
            <p className={`font-sans text-gray-300 font-light ${isPrint ? 'text-lg px-12' : 'text-[10px] px-4'}`}>Uchwyć chwile. Zeskanuj kod, aby przesłać zdjęcia.</p>
          </div>
          <div className={`absolute bottom-0 w-full flex justify-center ${isPrint ? 'pb-8' : 'pb-4'} z-10`}>
            <p className={`font-sans font-semibold tracking-widest text-yellow-400 opacity-90 ${isPrint ? 'text-sm' : 'text-[8px]'}`}>kliksy.pl</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'b9', category: 'Firmowe', name: 'Srebrna Linija', bg: '#f3f4f6',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventName || 'Wydarzenie firmowe';
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-gray-100 overflow-hidden">
          <div className="w-full flex flex-col items-center mt-10 z-10">
            <div className={`h-px bg-gray-400 w-full ${isPrint ? 'mb-6' : 'mb-3'}`}></div>
            <h1 className={`font-sans text-gray-800 font-bold uppercase tracking-widest ${isPrint ? 'text-3xl' : 'text-sm'}`}>{title}</h1>
            <div className={`h-px bg-gray-400 w-full ${isPrint ? 'mt-6' : 'mt-3'}`}></div>
          </div>
          <div className="flex flex-col items-center z-10">
            <p className={`font-sans text-gray-600 font-medium mb-6 ${isPrint ? 'text-xl px-10' : 'text-xs px-2'}`}>Tworzymy historię wydarzenia. Zrób zdjęcie i podziel się.</p>
            <div className={`p-3 bg-white border border-gray-300 shadow-sm`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#1f2937" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className={`absolute bottom-0 w-full flex justify-center ${isPrint ? 'pb-8' : 'pb-4'} z-10`}>
            <p className={`font-sans font-bold tracking-widest text-gray-400 ${isPrint ? 'text-sm' : 'text-[8px]'}`}>kliksy.pl</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'b10', category: 'Firmowe', name: 'Globoka Zelena', bg: '#064e3b',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventName || 'Wydarzenie firmowe';
      const date = event.date ? new Date(event.date).toLocaleDateString('pl-PL') : '';
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-emerald-950 overflow-hidden">
          <div className="w-full flex flex-col items-center mt-12 z-10">
            <h1 className={`font-serif text-emerald-100 font-medium ${isPrint ? 'text-4xl' : 'text-xl'}`}>{title}</h1>
            {date && <p className={`font-sans text-emerald-100 mt-2 tracking-widest uppercase ${isPrint ? 'text-lg' : 'text-[10px]'}`}>{date}</p>}
          </div>
          <div className="flex flex-col items-center z-10">
            <div className={`p-4 bg-emerald-50 rounded-lg shadow-2xl mb-6`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#f0fdf4" fgColor="#022c22" level="Q" includeMargin={false} />
            </div>
            <p className={`font-sans text-emerald-100 font-light ${isPrint ? 'text-lg px-12' : 'text-[10px] px-4'}`}>Buduj naszą wspólną galerię. Zeskanuj i prześlij wspomnienia.</p>
          </div>
          <div className={`absolute bottom-0 w-full flex justify-center ${isPrint ? 'pb-8' : 'pb-4'} z-10`}>
            <p className={`font-sans font-semibold tracking-widest text-emerald-400 opacity-80 ${isPrint ? 'text-sm' : 'text-[8px]'}`}>kliksy.pl</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'b11', category: 'Firmowe', name: 'Sodobna Siva', bg: '#3f3f46',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventName || 'Wydarzenie firmowe';
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-zinc-700 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-black"></div>
          <div className="w-full flex flex-col items-center mt-10 z-10 bg-zinc-500/80 py-4 px-8 rounded-xl backdrop-blur-sm shadow-lg">
            <h1 className={`font-sans text-white font-bold tracking-wide ${isPrint ? 'text-3xl' : 'text-lg'}`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{title}</h1>
          </div>
          <div className="flex flex-col items-center z-10 mt-4">
            <p className={`font-sans text-zinc-200 font-medium mb-6 ${isPrint ? 'text-xl px-10' : 'text-xs px-2'}`}>Twoje zdjęcia wzbogacają nasze wydarzenie. Zeskanuj i prześlij.</p>
            <div className={`p-3 bg-white rounded-xl shadow-lg`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#27272a" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className={`absolute bottom-0 w-full flex justify-center ${isPrint ? 'pb-8' : 'pb-4'} z-10`}>
            <p className={`font-sans font-bold tracking-widest text-zinc-300 opacity-60 ${isPrint ? 'text-sm' : 'text-[8px]'}`}>kliksy.pl</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'b12', category: 'Firmowe', name: 'Čista Profesionalnost', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventName || 'Wydarzenie firmowe';
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-white border-4 border-slate-900 overflow-hidden">
          <div className="w-full flex flex-col items-center mt-8 z-10">
            <h1 className={`font-serif text-slate-900 font-bold ${isPrint ? 'text-4xl' : 'text-xl'}`}>{title}</h1>
          </div>
          <div className="flex flex-col items-center z-10">
            <div className={`p-1 mb-6 border-2 border-slate-200`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#0f172a" level="Q" includeMargin={false} />
            </div>
            <p className={`font-sans text-slate-700 font-medium uppercase tracking-wider ${isPrint ? 'text-lg px-8' : 'text-[9px] px-2'}`}>Zrób zdjęcie i podziel się z nami.<br/>Zeskanuj kod QR.</p>
          </div>
          <div className={`absolute bottom-0 w-full flex justify-center ${isPrint ? 'pb-8' : 'pb-4'} z-10`}>
            <p className={`font-sans font-bold tracking-widest text-slate-300 ${isPrint ? 'text-sm' : 'text-[8px]'}`}>kliksy.pl</p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'b13', category: 'Firmowe', name: 'Topla Poslovna', bg: '#fafaf9',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventName || 'Wydarzenie firmowe';
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center z-10 bg-stone-50 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-stone-200/50 to-transparent pointer-events-none"></div>
          <div className="w-full flex flex-col items-center mt-10 z-10">
            <h1 className={`font-sans text-stone-800 font-semibold tracking-tight ${isPrint ? 'text-4xl' : 'text-xl'}`}>{title}</h1>
          </div>
          <div className="flex flex-col items-center z-10">
            <p className={`font-sans text-stone-600 mb-6 ${isPrint ? 'text-xl px-12' : 'text-xs px-4'}`}>Zachowajmy wspomnienia razem. Zrób zdjęcie, zeskanuj i udostępnij.</p>
            <div className={`p-4 bg-white rounded-2xl shadow-md border border-stone-100`}>
              <QRCodeComponent value={eventUrl} size={qrSize * 1.1} bgColor="#ffffff" fgColor="#44403c" level="Q" includeMargin={false} />
            </div>
          </div>
          <div className={`absolute bottom-0 w-full flex justify-center ${isPrint ? 'pb-8' : 'pb-4'} z-10`}>
            <p className={`font-sans font-semibold tracking-widest text-stone-300 ${isPrint ? 'text-sm' : 'text-[8px]'}`}>kliksy.pl</p>
          </div>
        </div>
      );
    }
  }
];
