import React, { useState } from 'react';
import { Trash2, Copy, ChevronDown, ChevronUp, MoveUp, MoveDown, Percent, DollarSign } from 'lucide-react';
import { CurrencyCode, InvoiceItem } from '../types';
import { calculateLineTotal, formatCurrency } from '../utils/calculations';

interface ItemRowProps {
  item: InvoiceItem;
  index: number;
  totalItems: number;
  currency: CurrencyCode;
  showTaxColumn: boolean;
  showDiscountColumn: boolean;
  onUpdate: (id: string, updatedFields: Partial<InvoiceItem>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (item: InvoiceItem) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  item,
  index,
  totalItems,
  currency,
  showTaxColumn,
  showDiscountColumn,
  onUpdate,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}) => {
  const [showDetails, setShowDetails] = useState(Boolean(item.details));
  const lineTotal = calculateLineTotal(item);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:border-slate-300 transition-all shadow-sm group text-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        
        {/* Row Number & Reorder */}
        <div className="col-span-1 md:col-span-1 flex items-center justify-between md:justify-start gap-1 pt-2">
          <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-medium flex items-center justify-center">
            {index + 1}
          </span>
          <div className="flex md:flex-col gap-0.5 opacity-60 group-hover:opacity-100 transition">
            {onMoveUp && index > 0 && (
              <button
                type="button"
                onClick={() => onMoveUp(index)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded"
                title="Move up"
              >
                <MoveUp className="w-3 h-3" />
              </button>
            )}
            {onMoveDown && index < totalItems - 1 && (
              <button
                type="button"
                onClick={() => onMoveDown(index)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded"
                title="Move down"
              >
                <MoveDown className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Item Title & Details Toggle */}
        <div className="col-span-1 md:col-span-5 space-y-2">
          <div>
            <input
              type="text"
              value={item.description}
              onChange={(e) => onUpdate(item.id, { description: e.target.value })}
              placeholder="Service or product description..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-md px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-indigo-600 outline-none transition"
            />
          </div>

          {/* Toggle details text area */}
          <div>
            {showDetails ? (
              <div className="mt-1">
                <textarea
                  value={item.details || ''}
                  onChange={(e) => onUpdate(item.id, { details: e.target.value })}
                  placeholder="Additional line item specifications, breakdown or work notes..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-md p-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition resize-y"
                />
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 mt-0.5 flex items-center gap-1"
                >
                  <ChevronUp className="w-3 h-3" /> Hide extra description
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 mt-0.5"
              >
                <ChevronDown className="w-3 h-3" /> + Add sub-details or notes
              </button>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div className="col-span-1 md:col-span-2 space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 md:hidden">
            Qty
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={item.quantity}
            onChange={(e) => onUpdate(item.id, { quantity: parseFloat(e.target.value) || 0 })}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-md px-2.5 py-1.5 text-sm text-center font-mono text-slate-900 outline-none"
          />
        </div>

        {/* Unit Price */}
        <div className="col-span-1 md:col-span-2 space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 md:hidden">
            Unit Price
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={item.unitPrice}
              onChange={(e) => onUpdate(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-md px-2.5 py-1.5 text-sm font-mono text-right text-slate-900 outline-none"
            />
          </div>
        </div>

        {/* Line Total & Row Actions */}
        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-1.5">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block md:hidden">Line Total</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {formatCurrency(lineTotal, currency)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDuplicate(item)}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition"
              title="Duplicate row"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
              title="Remove row"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Optional Item-Level Discount & Tax Strip */}
      {(showDiscountColumn || showTaxColumn) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          
          {showDiscountColumn && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 shrink-0 text-[11px]">Item Disc:</span>
              <div className="flex items-center gap-1 bg-slate-50 rounded-md border border-slate-200 p-0.5">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={item.discount}
                  onChange={(e) => onUpdate(item.id, { discount: parseFloat(e.target.value) || 0 })}
                  className="w-16 bg-transparent px-2 py-0.5 text-xs text-center font-mono outline-none text-slate-900"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdate(item.id, {
                      discountType: item.discountType === 'percent' ? 'fixed' : 'percent',
                    })
                  }
                  className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-semibold flex items-center gap-0.5"
                >
                  {item.discountType === 'percent' ? <Percent className="w-2.5 h-2.5" /> : <DollarSign className="w-2.5 h-2.5" />}
                </button>
              </div>
            </div>
          )}

          {showTaxColumn && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 shrink-0 text-[11px]">Tax Rate:</span>
              <div className="flex items-center gap-1 bg-slate-50 rounded-md border border-slate-200 p-0.5">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={item.taxRate}
                  onChange={(e) => onUpdate(item.id, { taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-16 bg-transparent px-2 py-0.5 text-xs text-center font-mono outline-none text-slate-900"
                />
                <span className="text-slate-400 pr-1.5 text-[11px]">%</span>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
