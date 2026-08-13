import React from 'react';
import { Invoice } from '../types';
import { calculateInvoiceTotals, formatCurrency, formatDate } from '../utils/calculations';
import { ACCENT_MAP, FONT_MAP, getStatusBadgeStyle } from '../utils/themeStyles';
import { Building2, Mail, Phone, Globe, CreditCard, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: Invoice;
  isPrintView?: boolean;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, isPrintView = false }) => {
  const totals = calculateInvoiceTotals(invoice);
  const theme = invoice.theme || {
    style: 'modern',
    accentColor: 'indigo',
    fontStyle: 'sans',
    showLogo: true,
    showTaxColumn: true,
    showDiscountColumn: true,
    showItemDetails: true,
    showPaymentInfo: true,
    showSignatureBlock: true,
    showNotes: true,
  };

  const accent = ACCENT_MAP[theme.accentColor] || ACCENT_MAP.indigo;
  const fontClass = FONT_MAP[theme.fontStyle] || 'font-sans';

  return (
    <div
      className={`printable-invoice-container w-full bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden ${fontClass} transition-all`}
    >
      {/* Printable Invoice Header Banner depending on theme.style */}
      {theme.style === 'modern' || theme.style === 'vibrant' ? (
        <div className={`p-8 sm:p-10 bg-gradient-to-r ${accent.headerGradient} text-white flex flex-col sm:flex-row justify-between items-start gap-6`}>
          {/* Company Branding */}
          <div className="space-y-3">
            {theme.showLogo && invoice.business?.logoUrl && (
              <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur p-2 border border-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src={invoice.business.logoUrl}
                  alt={invoice.business.name}
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{invoice.business.name || 'Company Name'}</h2>
              {invoice.business.taxId && (
                <p className="text-xs text-white/80 font-mono mt-0.5">{invoice.business.taxId}</p>
              )}
            </div>
          </div>

          {/* Invoice Title & Number */}
          <div className="sm:text-right space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur border border-white/20">
              INVOICE
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight font-mono">{invoice.invoiceNumber}</h1>
            <div className="flex items-center sm:justify-end gap-2 text-xs text-white/90">
              <span>Status:</span>
              <span className="font-bold underline uppercase tracking-wider">{invoice.status}</span>
            </div>
          </div>
        </div>
      ) : theme.style === 'corporate' ? (
        <div className="p-8 border-b-4 border-slate-900 bg-slate-50 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-2">
            {theme.showLogo && invoice.business?.logoUrl && (
              <img
                src={invoice.business.logoUrl}
                alt={invoice.business.name}
                className="h-12 w-auto object-contain mb-2"
                referrerPolicy="no-referrer"
              />
            )}
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide">{invoice.business.name}</h2>
            <p className="text-xs text-slate-500 font-mono">{invoice.business.taxId}</p>
          </div>
          <div className="sm:text-right">
            <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">Tax Invoice</span>
            <h1 className="text-3xl font-black text-slate-900 font-mono">{invoice.invoiceNumber}</h1>
          </div>
        </div>
      ) : (
        /* Minimal / Classic Header */
        <div className="p-8 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-2">
            {theme.showLogo && invoice.business?.logoUrl && (
              <img
                src={invoice.business.logoUrl}
                alt={invoice.business.name}
                className="h-12 w-auto object-contain mb-2"
                referrerPolicy="no-referrer"
              />
            )}
            <h2 className="text-xl font-bold text-slate-900">{invoice.business.name}</h2>
            <p className="text-xs text-slate-500">{invoice.business.taxId}</p>
          </div>
          <div className="sm:text-right space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">{invoice.invoiceNumber}</h1>
            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="p-8 sm:p-10 space-y-8">
        
        {/* Addresses & Dates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600 border-b border-slate-100 pb-8">
          
          {/* Billed From */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
              From (Provider)
            </span>
            <p className="font-semibold text-slate-900 text-sm">{invoice.business.name}</p>
            {invoice.business.address && <p>{invoice.business.address}</p>}
            {(invoice.business.cityStateZip || invoice.business.country) && (
              <p>{[invoice.business.cityStateZip, invoice.business.country].filter(Boolean).join(', ')}</p>
            )}
            {invoice.business.email && <p className="text-slate-500">{invoice.business.email}</p>}
            {invoice.business.phone && <p className="text-slate-500">{invoice.business.phone}</p>}
            {invoice.business.website && <p className="text-indigo-600 font-medium">{invoice.business.website}</p>}
          </div>

          {/* Billed To */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
              Billed To (Client)
            </span>
            <p className="font-semibold text-slate-900 text-sm">
              {invoice.client.companyName || invoice.client.name || 'Client Name'}
            </p>
            {invoice.client.name && invoice.client.companyName && (
              <p className="text-slate-700 font-medium">Attn: {invoice.client.name}</p>
            )}
            {invoice.client.address && <p>{invoice.client.address}</p>}
            {(invoice.client.cityStateZip || invoice.client.country) && (
              <p>{[invoice.client.cityStateZip, invoice.client.country].filter(Boolean).join(', ')}</p>
            )}
            {invoice.client.email && <p className="text-slate-500">{invoice.client.email}</p>}
            {invoice.client.phone && <p className="text-slate-500">{invoice.client.phone}</p>}
            {invoice.client.taxId && <p className="font-mono text-[11px] text-slate-400">VAT/Tax: {invoice.client.taxId}</p>}
          </div>

          {/* Key Dates & Meta */}
          <div className="space-y-2 sm:text-right bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Issue Date
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {formatDate(invoice.issueDate)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Due Date
              </span>
              <span className="font-mono font-bold text-indigo-600 text-sm">
                {formatDate(invoice.dueDate)}
              </span>
            </div>
            {invoice.paymentTerms && (
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Payment Terms
                </span>
                <span className="font-medium text-slate-700">{invoice.paymentTerms}</span>
              </div>
            )}
            {invoice.poNumber && (
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  PO Number
                </span>
                <span className="font-mono font-semibold text-slate-800">{invoice.poNumber}</span>
              </div>
            )}
          </div>

        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-2 w-12 text-center">#</th>
                <th className="py-3 px-2">Item & Description</th>
                <th className="py-3 px-2 text-center w-20">Qty</th>
                <th className="py-3 px-2 text-right w-28">Unit Price</th>
                {theme.showDiscountColumn && <th className="py-3 px-2 text-right w-24">Discount</th>}
                <th className="py-3 px-2 text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item, idx) => {
                const qty = Math.max(0, Number(item.quantity) || 0);
                const price = Math.max(0, Number(item.unitPrice) || 0);
                const gross = qty * price;
                let discStr = '-';
                if (item.discount > 0) {
                  discStr = item.discountType === 'percent' ? `${item.discount}%` : formatCurrency(item.discount, invoice.currency);
                }
                const lineVal = (qty * price) - (item.discountType === 'percent' ? (gross * item.discount) / 100 : item.discount);

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-2 text-center font-mono text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-2">
                      <p className="font-bold text-slate-900 text-sm">{item.description}</p>
                      {theme.showItemDetails && item.details && (
                        <p className="text-slate-500 text-xs mt-1 whitespace-pre-line leading-relaxed">
                          {item.details}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center font-mono text-slate-700 font-medium">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-slate-700">
                      {formatCurrency(price, invoice.currency)}
                    </td>
                    {theme.showDiscountColumn && (
                      <td className="py-4 px-2 text-right font-mono text-slate-500">
                        {discStr}
                      </td>
                    )}
                    <td className="py-4 px-2 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(Math.max(0, lineVal), invoice.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculations & Totals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-slate-200">
          
          {/* Left Column: Bank / Payment Methods */}
          <div className="md:col-span-7 space-y-4">
            {theme.showPaymentInfo && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Payment Instructions & Bank Wire</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {invoice.bankInfo?.bankName && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bank Name</span>
                      <span className="font-semibold text-slate-800">{invoice.bankInfo.bankName}</span>
                    </div>
                  )}
                  {invoice.bankInfo?.accountName && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Account Name</span>
                      <span className="font-semibold text-slate-800">{invoice.bankInfo.accountName}</span>
                    </div>
                  )}
                  {invoice.bankInfo?.accountNumber && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Account / Number</span>
                      <span className="font-mono font-medium text-slate-800">{invoice.bankInfo.accountNumber}</span>
                    </div>
                  )}
                  {invoice.bankInfo?.routingNumber && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Routing / Sort Code</span>
                      <span className="font-mono font-medium text-slate-800">{invoice.bankInfo.routingNumber}</span>
                    </div>
                  )}
                  {invoice.bankInfo?.swiftBic && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">SWIFT / BIC</span>
                      <span className="font-mono font-medium text-slate-800">{invoice.bankInfo.swiftBic}</span>
                    </div>
                  )}
                  {invoice.bankInfo?.iban && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">IBAN</span>
                      <span className="font-mono font-medium text-slate-800">{invoice.bankInfo.iban}</span>
                    </div>
                  )}
                </div>

                {invoice.bankInfo?.paypalEmail && (
                  <div className="pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 font-medium">PayPal: </span>
                    <span className="font-mono text-indigo-600 font-semibold">{invoice.bankInfo.paypalEmail}</span>
                  </div>
                )}

                {invoice.bankInfo?.paymentUrl && (
                  <div className="pt-1 text-xs">
                    <span className="text-slate-500 font-medium">Online Payment Link: </span>
                    <a
                      href={invoice.bankInfo.paymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-indigo-600 underline hover:text-indigo-800 break-all"
                    >
                      {invoice.bankInfo.paymentUrl}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Notes & Terms */}
            {theme.showNotes && (invoice.notes || invoice.terms) && (
              <div className="space-y-3 text-xs text-slate-600">
                {invoice.notes && (
                  <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3">
                    <span className="font-bold text-amber-900 block mb-1">Notes:</span>
                    <p className="leading-relaxed text-amber-800">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Terms & Conditions:</span>
                    <p className="leading-relaxed text-slate-500">{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Financial Totals Box */}
          <div className="md:col-span-5 space-y-3 text-xs font-medium text-slate-600">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2.5">
              
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatCurrency(totals.subtotal, invoice.currency)}
                </span>
              </div>

              {totals.globalDiscountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-600">
                  <span>
                    Discount {invoice.globalDiscountType === 'percent' ? `(${invoice.globalDiscount}%)` : ''}
                  </span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(totals.globalDiscountAmount, invoice.currency)}
                  </span>
                </div>
              )}

              {totals.taxAmount > 0 && (
                <div className="flex justify-between items-center">
                  <span>
                    Tax / VAT {invoice.taxType === 'global' ? `(${invoice.taxRate}%)` : ''}
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    +{formatCurrency(totals.taxAmount, invoice.currency)}
                  </span>
                </div>
              )}

              {totals.shipping > 0 && (
                <div className="flex justify-between items-center">
                  <span>Shipping & Additional Charges</span>
                  <span className="font-mono font-bold text-slate-800">
                    +{formatCurrency(totals.shipping, invoice.currency)}
                  </span>
                </div>
              )}

              <div className="border-t-2 border-slate-200 pt-3 flex justify-between items-center text-base font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="font-mono text-lg text-indigo-600">
                  {formatCurrency(totals.grandTotal, invoice.currency)}
                </span>
              </div>

              {totals.amountPaid > 0 && (
                <div className="flex justify-between items-center text-emerald-700 pt-1">
                  <span>Amount Paid</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(totals.amountPaid, invoice.currency)}
                  </span>
                </div>
              )}

              {/* Balance Due Highlight Callout */}
              <div className={`mt-3 p-3 rounded-lg flex justify-between items-center border ${
                totals.isFullyPaid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : totals.balanceDue > 0
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}>
                <div>
                  <span className="text-[10px] uppercase tracking-wider block font-bold opacity-80">
                    {totals.isFullyPaid ? 'Status' : 'Balance Due'}
                  </span>
                  <span className="text-lg font-bold font-mono">
                    {totals.isFullyPaid ? 'FULLY PAID' : formatCurrency(totals.balanceDue, invoice.currency)}
                  </span>
                </div>
                {totals.isFullyPaid ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <ShieldCheck className="w-6 h-6 opacity-60" />
                )}
              </div>

            </div>

            {/* Optional Signature Block */}
            {theme.showSignatureBlock && (
              <div className="pt-8 grid grid-cols-2 gap-6 text-center text-slate-400">
                <div className="border-t border-slate-300 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Authorized Signature</span>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Date</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer note */}
        {theme.customFooterNote && (
          <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
            <p>{theme.customFooterNote}</p>
          </div>
        )}

      </div>
    </div>
  );
};
