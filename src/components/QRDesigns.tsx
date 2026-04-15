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
      <circle cx="350" cy="50" r="80" fill="#FBCFE8" opacity="0.4" filter="blur(20px)" />
      <circle cx="400" cy="150" r="60" fill="#FDE68A" opacity="0.3" filter="blur(20px)" />
      <circle cx="280" cy="-20" r="70" fill="#A7F3D0" opacity="0.3" filter="blur(20px)" />
      
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
      <circle cx="50" cy="550" r="80" fill="#FBCFE8" opacity="0.4" filter="blur(20px)" />
      <circle cx="0" cy="450" r="60" fill="#FDE68A" opacity="0.3" filter="blur(20px)" />
      <circle cx="120" cy="620" r="70" fill="#A7F3D0" opacity="0.3" filter="blur(20px)" />
      
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

const WeddingTextContent = ({ event, isPrint }: { event: any, isPrint: boolean }) => {
  const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
  const date = new Date(event.date).toLocaleDateString('sl-SI');
  
  return (
    <div className="flex flex-col items-center mb-4 z-10 relative">
      <h1 className={`font-serif italic text-[#9A7B4F] ${isPrint ? 'text-5xl' : 'text-2xl'} leading-tight text-center`}>
        Ujemi najine<br/>najlepše trenutke <CameraIcon className={`inline-block ${isPrint ? 'w-10 h-10' : 'w-6 h-6'} ml-1 -mt-2`} color="#9A7B4F" />
      </h1>
      <div className={`text-center ${isPrint ? 'mt-8' : 'mt-4'}`}>
        <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-xl' : 'text-xs'} uppercase tracking-widest font-medium`}>{title}</p>
        <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-lg' : 'text-[10px]'} uppercase tracking-widest mt-1`}>{date}</p>
      </div>
    </div>
  );
};

const WeddingFooterContent = ({ isPrint }: { isPrint: boolean }) => (
  <div className={`flex flex-col items-center text-center z-10 relative ${isPrint ? 'mt-8' : 'mt-4'}`}>
    <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-xl' : 'text-xs'} mb-2`}>Skeniraj me</p>
    <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-lg' : 'text-[10px]'} leading-relaxed`}>
      Dodaj svoje fotografije in<br/>poglej utrinke tega dne.
    </p>
    <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-lg' : 'text-[10px]'} ${isPrint ? 'mt-6' : 'mt-3'}`}>
      Hvala, ker soustvarjaš spomine ✨
    </p>
    <p className={`font-sans text-[#9A7B4F] ${isPrint ? 'text-sm' : 'text-[8px]'} ${isPrint ? 'mt-8' : 'mt-4'} opacity-70`}>
      kliksy.si
    </p>
  </div>
);

// --- DESIGNS ---

export const DESIGNS = [
  // ==========================================
  // POROČNI DIZAJNI (Po inspiraciji)
  // ==========================================
  {
    id: 'w1', category: 'Poročni', name: 'Zlate Linije', bg: '#ffffff',
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
    id: 'w2', category: 'Poročni', name: 'Cvetlična Romantika', bg: '#ffffff',
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
    id: 'w3', category: 'Poročni', name: 'Geometrijska Eleganca', bg: '#ffffff',
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
    id: 'w4', category: 'Poročni', name: 'Noč za spomine (Po meri)', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      const title = event.eventType === 'poroka' || !event.eventType ? `${event.partner1} & ${event.partner2}` : event.eventName;
      const date = new Date(event.date).toLocaleDateString('sl-SI');
      
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center z-10 bg-white overflow-hidden">
          {/* Ozadje - slika, ki jo naloži uporabnik */}
          <img 
            src="https://raw.githubusercontent.com/jakcmeglic/Kliksy.si/88eed03337e18f3e03a77a25db4b8d9e018dfe69/public/template-custom.png" 
            alt="Custom Template Background" 
            className="absolute inset-0 w-full h-full object-cover z-0"
            onError={(e) => {
              // Fallback, če slika še ni naložena
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          
          {/* Fallback ozadje, če slike ni */}
          <div className="absolute inset-0 bg-gray-100 z-[-1] flex items-center justify-center text-gray-400 text-sm text-center px-4">
            Slika ozadja manjka.<br/>Naloži 'template-custom.png' v mapo 'public'.
          </div>

          {/* Dinamična vsebina */}
          <div className="absolute inset-0 z-10 flex flex-col items-center w-full h-full">
            
            {/* Ime dogodka in datum - pozicionirano na ~18% od vrha */}
            <div className="absolute top-[17%] w-full flex flex-col items-center justify-center text-center px-8">
              <h1 className={`font-sans text-black font-black uppercase tracking-wide ${isPrint ? 'text-4xl' : 'text-xl'}`} style={{ textShadow: '2px 2px 0px white, -2px -2px 0px white, 2px -2px 0px white, -2px 2px 0px white' }}>
                {title}
              </h1>
              <p className={`font-sans text-black font-bold uppercase ${isPrint ? 'text-2xl mt-2' : 'text-sm mt-1'}`} style={{ textShadow: '1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white' }}>
                {date}
              </p>
            </div>

            {/* QR Koda - pozicionirana na sredini (~50% od vrha) */}
            <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-xl shadow-lg">
              <QRCodeComponent value={eventUrl} size={qrSize * 1.4} bgColor="#ffffff" fgColor="#000000" level="Q" includeMargin={false} />
            </div>
            
          </div>
        </div>
      );
    }
  },

  // ==========================================
  // NEVTRALNI DIZAJNI
  // ==========================================
  {
    id: 'n1', category: 'Nevtralni', name: 'Čisti Minimalizem', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-white">
          <h1 className={`font-sans text-gray-900 ${isPrint ? 'text-3xl mb-10' : 'text-lg mb-6'} font-bold uppercase tracking-[0.3em]`}>
            Deli fotke z nami
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
    id: 'n2', category: 'Nevtralni', name: 'Eleganca', bg: '#F9FAFB',
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
            Prosimo, deli fotografije z nami.
          </p>
        </div>
      );
    }
  },
  {
    id: 'n3', category: 'Nevtralni', name: 'Okvir', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-white">
          <div className="absolute inset-4 border-[6px] border-gray-900 pointer-events-none"></div>
          
          <div className={`p-2 bg-white mb-8`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <h1 className={`font-sans text-gray-900 ${isPrint ? 'text-3xl' : 'text-sm'} font-black uppercase tracking-widest px-4`}>
            Skeniraj & deli fotke z nami
          </h1>
        </div>
      );
    }
  },
  {
    id: 'n4', category: 'Nevtralni', name: 'Temna Eleganca', bg: '#111827',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-gray-900">
          <p className={`font-sans text-gray-400 ${isPrint ? 'text-xl mb-8' : 'text-[10px] mb-4'} uppercase tracking-widest`}>
            {event.eventName}
          </p>
          
          <div className={`p-4 bg-white rounded-2xl mb-8`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <h1 className={`font-serif text-white ${isPrint ? 'text-4xl' : 'text-lg'} font-medium`}>
            Deli svoje fotke z nami
          </h1>
        </div>
      );
    }
  },

  // ==========================================
  // POSLOVNI DIZAJNI
  // ==========================================
  {
    id: 'b1', category: 'Poslovni', name: 'Korporativni', bg: '#F8FAFC',
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
              Delite fotografije z nami
            </p>
            <p className={`font-sans text-slate-500 ${isPrint ? 'text-sm mt-2' : 'text-[8px] mt-1'}`}>
              Skenirajte kodo za prenos datotek.
            </p>
          </div>
        </div>
      );
    }
  },
  {
    id: 'b2', category: 'Poslovni', name: 'Konferenca', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-white border-4 border-slate-100">
          <h1 className={`font-sans text-slate-800 ${isPrint ? 'text-3xl mb-8' : 'text-sm mb-4'} font-bold uppercase tracking-widest`}>
            Skenirajte kodo in delite fotografije z nami
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
    id: 'b3', category: 'Poslovni', name: 'Profesionalni', bg: '#0F172A',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-10 text-center z-10 bg-slate-900">
          <p className={`font-sans text-slate-400 ${isPrint ? 'text-xl' : 'text-xs'} uppercase tracking-widest font-medium`}>
            {event.eventName}
          </p>
          
          <div className={`p-4 bg-white rounded-xl`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <h1 className={`font-sans text-white ${isPrint ? 'text-3xl' : 'text-sm'} font-light tracking-wide`}>
            Prosimo, delite svoje fotografije z nami.
          </h1>
        </div>
      );
    }
  },
  {
    id: 'b4', category: 'Poslovni', name: 'Vizitka', bg: '#ffffff',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-row items-center justify-between p-8 z-10 bg-white">
          <div className="flex-1 pr-4">
            <h1 className={`font-sans text-slate-900 ${isPrint ? 'text-4xl mb-6' : 'text-xl mb-3'} font-black uppercase leading-tight`}>
              Delite<br/>fotke<br/>z nami.
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
  // ROJSTNODNEVNI DIZAJNI
  // ==========================================
  {
    id: 'p1', category: 'Rojstnodnevni', name: 'Zabava', bg: '#FEF08A',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-yellow-200">
          <Confetti className="absolute inset-0 pointer-events-none" />
          
          <h1 className={`font-sans text-amber-700 ${isPrint ? 'text-5xl mb-8' : 'text-2xl mb-4'} font-black uppercase rotate-[-2deg] z-20`}>
            Deli fotke z moje zabave!
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
    id: 'p2', category: 'Rojstnodnevni', name: 'Baloni', bg: '#DBEAFE',
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
              Slikaj in deli fotke z mano!
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
    id: 'p3', category: 'Rojstnodnevni', name: 'Neon', bg: '#18181B',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-zinc-900">
          <div className="absolute inset-6 border-2 border-pink-500 rounded-2xl opacity-50 pointer-events-none"></div>
          
          <h1 className={`font-sans text-pink-500 ${isPrint ? 'text-5xl mb-10' : 'text-2xl mb-6'} font-black uppercase tracking-widest drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]`}>
            Deli fotke<br/>z nami!
          </h1>
          
          <div className={`p-3 bg-white border-2 border-cyan-400 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.5)] mb-10`}>
            <QRCodeComponent value={eventUrl} size={qrSize} bgColor="#ffffff" fgColor="#111827" level="Q" includeMargin={false} />
          </div>
          
          <p className={`font-sans text-cyan-400 ${isPrint ? 'text-xl' : 'text-xs'} font-bold uppercase tracking-widest`}>
            {event.eventName}
          </p>
        </div>
      );
    }
  },
  {
    id: 'p4', category: 'Rojstnodnevni', name: 'Strip', bg: '#FEF2F2',
    render: ({ event, eventUrl, QRCodeComponent, qrSize, isPrint }: DesignProps) => {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center z-10 bg-red-50 border-8 border-black">
          <ComicRays className="absolute inset-0 pointer-events-none" color="#EF4444" />
          
          <div className="bg-yellow-300 border-4 border-black p-4 mb-8 transform -rotate-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-20">
            <h1 className={`font-sans text-black ${isPrint ? 'text-4xl' : 'text-xl'} font-black uppercase italic`}>
              BAM! Deli fotke<br/>z mano!
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
  }
];
