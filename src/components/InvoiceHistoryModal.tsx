import React, { useState } from 'react';
import { X, History, Search, Trash2, ExternalLink, Copy, Filter, FileText } from 'lucide-react';
import { Invoice, PaymentStatus } from '../types';
import { calculateInvoiceTotals, formatCurrency, formatDate } from '../utils/calculations';
import { getStatusBadgeStyle } from '../utils/themeStyles';

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  history: Invoice[];
  currentInvoiceId: string;
  onClose: () => void;
  onLoadInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onClearHistory: () => void;
}

export const InvoiceHistoryModal: React.FC<InvoiceHistoryModalProps> = ({
  isOpen,
  history,
  currentInvoiceId,
  onClose,
  onLoadInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  if (!isOpen) return null;

  const filteredHistory = history.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.client?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Saved Invoices History ({history.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Status Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Invoice # or Client Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-md pl-9 pr-3 py-2 text-xs text-slate-900 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No saved invoices match your criteria.
            </div>
          ) : (
            filteredHistory.map((inv) => {
              const totals = calculateInvoiceTotals(inv);
              const isActive = inv.id === currentInvoiceId;

              return (
                <div
                  key={inv.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    isActive
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-indigo-600">
                        {inv.invoiceNumber}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(inv.status)}`}>
                        {inv.status}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Editing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-900 font-semibold">
                      Client: {inv.client?.companyName || inv.client?.name || 'Unnamed Client'}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>Issued: {formatDate(inv.issueDate)}</span>
                      <span>•</span>
                      <span>Due: {formatDate(inv.dueDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="sm:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Grand Total</span>
                      <span className="text-sm font-bold font-mono text-slate-900">
                        {formatCurrency(totals.grandTotal, inv.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onLoadInvoice(inv);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Open
                      </button>
                      <button
                        onClick={() => onDuplicateInvoice(inv)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-md transition"
                        title="Duplicate as new draft"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteInvoice(inv.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition"
                        title="Delete invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all invoice history?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Clear All Saved
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold ml-auto"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
