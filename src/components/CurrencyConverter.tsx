import React, { useState } from 'react';
import { RefreshCw, ArrowRight, DollarSign, Check, Info, Settings2 } from 'lucide-react';
import { CurrencyCode, Invoice } from '../types';
import {
  CURRENCIES,
  MAJOR_CURRENCIES,
  DEFAULT_EXCHANGE_RATES,
  getExchangeRate,
  convertInvoiceCurrency,
  formatCurrency,
  calculateInvoiceTotals
} from '../utils/calculations';

interface CurrencyConverterProps {
  invoice: Invoice;
  onConvertInvoice: (updatedInvoice: Invoice) => void;
  compact?: boolean;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  invoice,
  onConvertInvoice,
  compact = false,
}) => {
  const currentCurrency = invoice.currency || 'USD';
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>(
    currentCurrency === 'EUR' ? 'USD' : 'EUR'
  );

  // Custom rate override input
  const defaultRate = getExchangeRate(currentCurrency, targetCurrency);
  const [customRate, setCustomRate] = useState<string>('');
  const [useCustomRate, setUseCustomRate] = useState<boolean>(false);
  const [convertedNotice, setConvertedNotice] = useState<string | null>(null);

  const activeRate = useCustomRate && !isNaN(parseFloat(customRate)) && parseFloat(customRate) > 0
    ? parseFloat(customRate)
    : defaultRate;

  const currentTotals = calculateInvoiceTotals(invoice);

  // Calculate what preview values would be
  const previewInvoice = convertInvoiceCurrency(invoice, targetCurrency, activeRate);
  const previewTotals = calculateInvoiceTotals(previewInvoice);

  const handleCurrencySelect = (code: CurrencyCode) => {
    if (code === currentCurrency) return;
    
    setTargetCurrency(code);
    setUseCustomRate(false);
    setCustomRate('');

    const newRate = getExchangeRate(currentCurrency, code);
    const updated = convertInvoiceCurrency(invoice, code, newRate);
    onConvertInvoice(updated);

    const fromSymbol = CURRENCIES[currentCurrency]?.symbol || '';
    const toSymbol = CURRENCIES[code]?.symbol || '';
    setConvertedNotice(
      `Converted all unit prices from ${currentCurrency} (${fromSymbol}) to ${code} (${toSymbol}) at rate 1 ${currentCurrency} = ${newRate.toFixed(4)} ${code}`
    );

    setTimeout(() => {
      setConvertedNotice(null);
    }, 4000);
  };

  const handleApplyConversion = () => {
    const updated = convertInvoiceCurrency(invoice, targetCurrency, activeRate);
    onConvertInvoice(updated);

    const fromSymbol = CURRENCIES[currentCurrency]?.symbol || '';
    const toSymbol = CURRENCIES[targetCurrency]?.symbol || '';
    setConvertedNotice(
      `Updated item prices to ${targetCurrency} (${toSymbol}) at rate ${activeRate.toFixed(4)}`
    );

    setTimeout(() => {
      setConvertedNotice(null);
    }, 4000);
  };

  if (compact) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-800">Quick Currency Toggle</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Current: {currentCurrency} ({CURRENCIES[currentCurrency]?.symbol})
          </span>
        </div>

        {/* Currency Toggle Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {MAJOR_CURRENCIES.map((code) => {
            const isCurrent = code === currentCurrency;
            const config = CURRENCIES[code];
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleCurrencySelect(code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 border ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                }`}
                title={`Convert all prices to ${config.name}`}
              >
                <span className="font-mono text-[11px]">{config.symbol}</span>
                <span>{code}</span>
                {isCurrent && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {convertedNotice && (
          <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-1.5 flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{convertedNotice}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm text-slate-900">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Auto Currency Converter
            </h3>
            <p className="text-xs text-slate-500">
              Switch currency and recalculate unit prices for all items.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
          {currentCurrency} ({CURRENCIES[currentCurrency]?.symbol})
        </span>
      </div>

      {/* Major Currencies Quick Toggle Buttons */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Select Major Target Currency
        </label>
        <div className="grid grid-cols-5 gap-2">
          {MAJOR_CURRENCIES.map((code) => {
            const isCurrent = code === currentCurrency;
            const config = CURRENCIES[code];
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleCurrencySelect(code)}
                className={`py-2 px-1.5 rounded-lg border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'
                }`}
              >
                <span className="text-xs font-bold font-mono">{config.symbol}</span>
                <span className="text-[11px] font-semibold">{code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Exchange Rate & Conversion Calculator */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Target Currency:</span>
            <select
              value={targetCurrency}
              onChange={(e) => {
                const newTarget = e.target.value as CurrencyCode;
                setTargetCurrency(newTarget);
                setUseCustomRate(false);
                setCustomRate('');
              }}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-900 focus:border-indigo-600 outline-none"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs font-mono text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
            Rate: 1 {currentCurrency} = {activeRate.toFixed(4)} {targetCurrency}
          </div>
        </div>

        {/* Custom Rate Input Toggle */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomRate}
              onChange={(e) => setUseCustomRate(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Override Exchange Rate</span>
          </label>

          {useCustomRate && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-mono">1 {currentCurrency} =</span>
              <input
                type="number"
                step="any"
                placeholder={defaultRate.toString()}
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 focus:border-indigo-600 outline-none"
              />
              <span className="text-[11px] text-slate-400 font-mono">{targetCurrency}</span>
            </div>
          )}
        </div>

        {/* Total Price Conversion Preview */}
        {currentCurrency !== targetCurrency && (
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Current Total</span>
                <span className="font-mono font-bold text-slate-700">
                  {formatCurrency(currentTotals.grandTotal, currentCurrency)}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-indigo-600 block uppercase font-bold">Converted Total</span>
                <span className="font-mono font-bold text-indigo-600 text-sm">
                  {formatCurrency(previewTotals.grandTotal, targetCurrency)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyConversion}
              className="w-full sm:w-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalculate & Apply {targetCurrency}</span>
            </button>
          </div>
        )}
      </div>

      {convertedNotice && (
        <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md p-2.5 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{convertedNotice}</span>
        </div>
      )}

      {/* Item Price Preview List */}
      {invoice.items.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Item Price Preview ({invoice.items.length} items)
          </span>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
            {invoice.items.map((item, idx) => {
              const convertedPrice = Number(((item.unitPrice || 0) * activeRate).toFixed(CURRENCIES[targetCurrency]?.decimals ?? 2));
              return (
                <div key={item.id || idx} className="flex items-center justify-between text-xs py-1 px-2 bg-white rounded border border-slate-200/80">
                  <span className="truncate max-w-[200px] text-slate-800 font-medium">
                    {item.description || `Item #${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">
                      {formatCurrency(item.unitPrice, currentCurrency)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className="font-bold text-indigo-600">
                      {formatCurrency(convertedPrice, targetCurrency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
