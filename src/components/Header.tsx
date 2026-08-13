import React from 'react';
import {
  FileText,
  Printer,
  Plus,
  History,
  Users,
  BookOpen,
  Mail,
  Download,
  Eye,
  Edit3,
  Columns,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { CurrencyCode, Invoice, PaymentStatus } from '../types';
import { getStatusBadgeStyle } from '../utils/themeStyles';
import { CURRENCIES, MAJOR_CURRENCIES, convertInvoiceCurrency } from '../utils/calculations';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  invoice: Invoice;
  viewMode: 'edit' | 'split' | 'preview';
  setViewMode: (mode: 'edit' | 'split' | 'preview') => void;
  savedCount: number;
  onNewInvoice: () => void;
  onOpenHistory: () => void;
  onOpenClients: () => void;
  onOpenCatalog: () => void;
  onOpenEmailModal: () => void;
  onPrintPDF: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
  onLoadPreset: (type: string) => void;
  onConvertInvoice?: (updatedInvoice: Invoice) => void;
}

export const Header: React.FC<HeaderProps> = ({
  invoice,
  viewMode,
  setViewMode,
  savedCount,
  onNewInvoice,
  onOpenHistory,
  onOpenClients,
  onOpenCatalog,
  onOpenEmailModal,
  onPrintPDF,
  onExportJSON,
  onImportJSON,
  onLoadPreset,
  onConvertInvoice,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm text-slate-900 no-print shrink-0">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Current Invoice Info */}
          <div className="flex items-center justify-between md:justify-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                I
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    ProInvoice <span className="text-slate-400 font-normal">Gen</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono text-slate-700 font-medium">{invoice.invoiceNumber}</span>
                  <span>•</span>
                  <span>{invoice.client?.companyName || invoice.client?.name || 'Draft Client'}</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadgeStyle(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Center: View Switcher */}
          <div className="flex items-center justify-center bg-slate-100 p-1 rounded-lg border border-slate-200/60 self-center">
            <button
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'edit'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Mode</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'split'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>

            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center flex-wrap justify-end gap-2">
            
            {/* Quick Currency Converter Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 hover:bg-indigo-100/70 text-indigo-700 border border-indigo-200 shadow-sm transition">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold">{invoice.currency} ({CURRENCIES[invoice.currency]?.symbol})</span>
              </button>
              <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Convert Currency & Prices
                </div>
                {MAJOR_CURRENCIES.map((code) => {
                  const cfg = CURRENCIES[code];
                  const isCurrent = code === invoice.currency;
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        if (onConvertInvoice && code !== invoice.currency) {
                          const updated = convertInvoiceCurrency(invoice, code);
                          onConvertInvoice(updated);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                        isCurrent
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs w-6 text-center font-bold text-slate-500">{cfg.symbol}</span>
                        <span>{cfg.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Presets Menu */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Presets</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
                <button
                  onClick={() => onLoadPreset('freelance')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Freelance Design</span>
                  <span className="text-[10px] text-slate-400">USD</span>
                </button>
                <button
                  onClick={() => onLoadPreset('agency')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Agency Development</span>
                  <span className="text-[10px] text-slate-400">EUR</span>
                </button>
                <button
                  onClick={() => onLoadPreset('consulting')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Business Consulting</span>
                  <span className="text-[10px] text-slate-400">GBP</span>
                </button>
              </div>
            </div>

            {/* Saved Clients */}
            <button
              onClick={onOpenClients}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition"
              title="Manage Saved Clients"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Clients</span>
            </button>

            {/* Item Catalog */}
            <button
              onClick={onOpenCatalog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition"
              title="Manage Services & Catalog Items"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Services</span>
            </button>

            {/* Invoices History */}
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition relative"
              title="Saved Invoices History"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">History</span>
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-mono border border-indigo-200 font-semibold">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Email Summary */}
            <button
              onClick={onOpenEmailModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition"
              title="Generate Ready Email Text"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Email</span>
            </button>

            {/* New Invoice */}
            <button
              onClick={onNewInvoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">New</span>
            </button>

            {/* Print / Download PDF */}
            <button
              onClick={onPrintPDF}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
