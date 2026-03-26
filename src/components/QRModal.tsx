import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const DESIGNS = [
  { id: 1, name: 'Minimalističen', container: 'bg-white border-2 border-gray-200', text: 'text-gray-900 font-sans', qrFg: '#111827', qrBg: '#ffffff' },
  { id: 2, name: 'Eleganten', container: 'bg-white border-4 border-double border-[#D4AF37]', text: 'text-gray-900 font-serif', qrFg: '#000000', qrBg: '#ffffff' },
  { id: 3, name: 'Rustikalen', container: 'bg-[#F5E6D3] border-2 border-dashed border-[#8B5A2B]', text: 'text-[#5C4033] font-serif', qrFg: '#3E2723', qrBg: '#F5E6D3' },
  { id: 4, name: 'Modern Temen', container: 'bg-gray-900 border-2 border-gray-700', text: 'text-white font-sans', qrFg: '#ffffff', qrBg: '#111827' },
  { id: 5, name: 'Botaničen', container: 'bg-[#F0FDF4] border-2 border-[#86EFAC]', text: 'text-[#14532D] font-serif', qrFg: '#14532D', qrBg: '#F0FDF4' },
  { id: 6, name: 'Klasičen Moder', container: 'bg-[#EFF6FF] border-4 border-[#1E3A8A]', text: 'text-[#1E3A8A] font-serif', qrFg: '#1E3A8A', qrBg: '#EFF6FF' },
  { id: 7, name: 'Geometričen', container: 'bg-white border-[8px] border-black', text: 'text-black font-sans uppercase tracking-widest', qrFg: '#000000', qrBg: '#ffffff' },
  { id: 8, name: 'Romantičen', container: 'bg-[#FFF1F2] border-2 border-[#FDA4AF] rounded-3xl', text: 'text-[#9F1239] font-serif', qrFg: '#9F1239', qrBg: '#FFF1F2' },
  { id: 9, name: 'Vintage', container: 'bg-[#FEF3C7] border-4 border-[#D97706]', text: 'text-[#78350F] font-serif', qrFg: '#78350F', qrBg: '#FEF3C7' },
  { id: 10, name: 'Zlat Prah', container: 'bg-gradient-to-br from-white to-[#FEF08A] border-2 border-[#EAB308]', text: 'text-[#854D0E] font-serif', qrFg: '#854D0E', qrBg: '#ffffff' },
];

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  eventUrl: string;
}

export default function QRModal({ isOpen, onClose, event, eventUrl }: QRModalProps) {
  const [selectedDesign, setSelectedDesign] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !event) return null;

  const selected = DESIGNS[selectedDesign];

  const generatePDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      // Capture the hidden element
      const canvas = await html2canvas(printRef.current, {
        scale: 3, // High quality for printing
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Create A4 PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // A4 dimensions: 210 x 297 mm
      // 4 cards per page, so each card is 105 x 148.5 mm (A6 format)
      const cardW = 105;
      const cardH = 148.5;

      // Add image 4 times (top-left, top-right, bottom-left, bottom-right)
      pdf.addImage(imgData, 'PNG', 0, 0, cardW, cardH);
      pdf.addImage(imgData, 'PNG', 105, 0, cardW, cardH);
      pdf.addImage(imgData, 'PNG', 0, 148.5, cardW, cardH);
      pdf.addImage(imgData, 'PNG', 105, 148.5, cardW, cardH);

      pdf.save(`QR-Listici-${event.partner1}-${event.partner2}.pdf`);
      onClose();
    } catch (error) {
      console.error("Napaka pri generiranju PDF:", error);
      alert("Prišlo je do napake pri generiranju PDF-ja.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold">Prenesi QR Lističe</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-gray-600 mb-6">
              Izberite dizajn za vaše QR lističe. Prenesel se bo PDF dokument formata A4, na katerem bodo 4 lističi (vsak formata A6), pripravljeni za tisk.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {DESIGNS.map((design, index) => (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesign(index)}
                  className={`relative aspect-[1/1.414] rounded-xl overflow-hidden border-2 transition-all ${
                    selectedDesign === index ? 'border-[var(--color-wedding-gold)] ring-4 ring-[var(--color-wedding-gold)]/20 shadow-lg scale-105 z-10' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Mini preview */}
                  <div className={`w-full h-full flex flex-col items-center justify-between p-2 text-center ${design.container}`}>
                    <div className="mt-1">
                      <div className={`text-[10px] font-bold leading-tight ${design.text}`}>
                        {event.partner1}<br/>&<br/>{event.partner2}
                      </div>
                    </div>
                    <div className="bg-white p-1 rounded shadow-sm">
                      <QRCodeSVG value={eventUrl} size={40} bgColor="#ffffff" fgColor="#2A2A2A" level="Q" includeMargin={false} />
                    </div>
                    <div className="mb-1">
                      <div className={`text-[6px] leading-tight ${design.text}`}>
                        Skeniraj QR kodo in<br/>deli svoje fotke
                      </div>
                    </div>
                  </div>
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] py-1 font-medium">
                    {design.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors">
              Prekliči
            </button>
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="px-6 py-2 rounded-xl font-medium bg-[var(--color-wedding-dark)] text-white hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generiram PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Prenesi PDF (A4)
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Hidden high-res container for html2canvas */}
        <div className="fixed top-[200vh] left-[200vw]">
          <div 
            ref={printRef} 
            className={`w-[400px] h-[566px] flex flex-col items-center justify-between p-10 text-center ${selected.container}`}
            style={{ boxSizing: 'border-box', backgroundColor: selected.container.includes('bg-') ? undefined : 'white' }}
          >
            <div className="mt-6">
              <h1 className={`text-4xl font-bold mb-4 leading-tight ${selected.text}`}>
                {event.partner1} & {event.partner2}
              </h1>
              <p className={`text-xl opacity-80 ${selected.text}`}>
                {new Date(event.date).toLocaleDateString('sl-SI')}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <QRCodeSVG 
                value={eventUrl} 
                size={220}
                bgColor="#ffffff"
                fgColor="#2A2A2A"
                level="Q"
                includeMargin={false}
              />
            </div>

            <div className="mb-8">
              <p className={`text-xl font-medium leading-snug ${selected.text}`}>
                Skeniraj QR kodo in<br/>deli svoje fotke z nama
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
