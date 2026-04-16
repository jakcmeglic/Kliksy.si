import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Loader2 } from 'lucide-react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

import { DESIGNS } from './QRDesigns';

const CATEGORIES = ['Poročni', 'Nevtralni', 'Poslovni', 'Rojstnodnevni'];

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  eventUrl: string;
  initialDesignId?: string;
}

export default function QRModal({ isOpen, onClose, event, eventUrl, initialDesignId }: QRModalProps) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [selectedDesignId, setSelectedDesignId] = useState(initialDesignId || DESIGNS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !event) return null;

  const selected = DESIGNS.find(d => d.id === selectedDesignId) || DESIGNS[0];
  const filteredDesigns = DESIGNS.filter(d => d.category === activeCategory);

  const generatePDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      // Save selected design to Firestore
      if (event && event.id) {
        try {
          await updateDoc(doc(db, 'events', event.id), {
            selectedDesignId: selectedDesignId
          });
        } catch (err) {
          console.error("Failed to save selected design:", err);
        }
      }

      // Capture the hidden element
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // Good balance between quality and memory
        useCORS: true,
        logging: false,
        backgroundColor: selected.bg,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      
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
      pdf.addImage(imgData, 'JPEG', 0, 0, cardW, cardH);
      pdf.addImage(imgData, 'JPEG', 105, 0, cardW, cardH);
      pdf.addImage(imgData, 'JPEG', 0, 148.5, cardW, cardH);
      pdf.addImage(imgData, 'JPEG', 105, 148.5, cardW, cardH);

      const eventNameStr = event.eventType === 'poroka' || !event.eventType ? `${event.partner1}-${event.partner2}` : event.eventName;
      const filename = `QR-Listici-${eventNameStr}.pdf`;
      const pdfBlob = pdf.output('blob');
      
      // Try Web Share API first for mobile devices
      let shared = false;
      if (navigator.canShare) {
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'QR Lističi',
              text: 'Tukaj so QR lističi za dogodek!',
            });
            shared = true;
          } catch (shareError) {
            console.log("Share cancelled or failed, falling back to download", shareError);
          }
        }
      }
      
      // Standard save fallback if share wasn't successful
      if (!shared) {
        try {
          pdf.save(filename);
        } catch (saveError) {
          console.warn("Standard save failed, trying fallback...", saveError);
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 100);
        }
      }
      
      onClose();
    } catch (error) {
      console.error("Napaka pri generiranju PDF:", error);
      alert("Prišlo je do napake pri generiranju PDF-ja. Poskusite znova ali uporabite drug brskalnik.");
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
           className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
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

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    const firstInCategory = DESIGNS.find(d => d.category === category);
                    if (firstInCategory) setSelectedDesignId(firstInCategory.id);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Designs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredDesigns.map((design) => (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesignId(design.id)}
                  className={`relative aspect-[1/1.414] rounded-xl overflow-hidden border-2 transition-all ${
                    selectedDesignId === design.id 
                      ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-lg scale-105 z-10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: design.bg }}
                >
                  {/* Mini preview */}
                  <div className="absolute inset-0 pointer-events-none">
                    {design.render({
                      event,
                      eventUrl,
                      QRCodeComponent: QRCodeSVG,
                      qrSize: 80,
                      isPrint: false
                    })}
                  </div>
                  
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs py-2 font-medium z-20">
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
              className="px-6 py-2 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
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
        <div style={{ position: 'fixed', top: 0, left: 0, opacity: 0.001, pointerEvents: 'none', zIndex: -50 }} aria-hidden="true">
          <div 
            ref={printRef} 
            className="relative w-[400px] h-[566px] flex flex-col items-center justify-center overflow-hidden"
            style={{ boxSizing: 'border-box', backgroundColor: selected.bg }}
          >
            {selected.render({
              event,
              eventUrl,
              QRCodeComponent: QRCodeCanvas,
              qrSize: 180,
              isPrint: true
            })}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
