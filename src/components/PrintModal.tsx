import React from 'react';
import { X, Printer, Download, Sparkles } from 'lucide-react';
import { Invoice } from '../types';
import { InvoicePreview } from './InvoicePreview';

interface PrintModalProps {
  isOpen: boolean;
  invoice: Invoice;
  onClose: () => void;
  onPrint: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  invoice,
  onClose,
  onPrint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto flex flex-col no-print">
      
      {/* Top Floating Controls */}
      <div className="sticky top-0 z-50 bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Print / Export PDF Preview</h3>
            <p className="text-xs text-slate-400">
              Select "Save as PDF" in your browser's print dialog to export a high quality PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onPrint}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Invoice Sheet */}
      <div className="flex-1 py-10 px-4 flex justify-center bg-slate-950/80">
        <div className="max-w-[850px] w-full">
          <InvoicePreview invoice={invoice} isPrintView={true} />
        </div>
      </div>

    </div>
  );
};
