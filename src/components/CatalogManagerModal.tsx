import React, { useState } from 'react';
import { X, BookOpen, Plus, Trash2, Check, DollarSign } from 'lucide-react';
import { CurrencyCode, InvoiceItem, SavedCatalogItem } from '../types';
import { formatCurrency } from '../utils/calculations';

interface CatalogManagerModalProps {
  isOpen: boolean;
  catalogItems: SavedCatalogItem[];
  currency: CurrencyCode;
  onClose: () => void;
  onAddItemToInvoice: (item: SavedCatalogItem) => void;
  onAddNewCatalogItem: (item: Omit<SavedCatalogItem, 'id'>) => void;
  onDeleteCatalogItem: (id: string) => void;
}

export const CatalogManagerModal: React.FC<CatalogManagerModalProps> = ({
  isOpen,
  catalogItems,
  currency,
  onClose,
  onAddItemToInvoice,
  onAddNewCatalogItem,
  onDeleteCatalogItem,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(100);
  const [taxRate, setTaxRate] = useState<number>(0);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddNewCatalogItem({
      title: title.trim(),
      description: description.trim(),
      unitPrice,
      taxRate,
    });
    setTitle('');
    setDescription('');
    setUnitPrice(100);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Services & Item Catalog</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add New Catalog Item Accordion */}
        {showAddForm ? (
          <form onSubmit={handleCreate} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Add New Service to Catalog</h4>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Service Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Mobile App Consulting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Description / Scope</label>
              <textarea
                rows={2}
                placeholder="Detailed description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md p-2 text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Standard Rate</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 outline-none font-mono focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Default Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 outline-none font-mono focus:border-indigo-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-sm"
              >
                Save Item
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-500 rounded-xl text-xs font-semibold text-indigo-600 flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Create Custom Preset Service
          </button>
        )}

        {/* Catalog Items List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          <span className="text-xs font-semibold text-slate-500 block">Catalog Preset Items ({catalogItems.length})</span>
          {catalogItems.map((cat) => (
            <div
              key={cat.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between gap-3 transition shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">{cat.title}</p>
                {cat.description && <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>}
                <p className="text-xs font-mono font-bold text-slate-900">
                  {formatCurrency(cat.unitPrice, currency)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onAddItemToInvoice(cat)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Insert Row
                </button>
                <button
                  onClick={() => onDeleteCatalogItem(cat.id)}
                  className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
