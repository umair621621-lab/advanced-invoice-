import React, { useState } from 'react';
import { X, Mail, Copy, Check, Send } from 'lucide-react';
import { Invoice } from '../types';
import { calculateInvoiceTotals, formatCurrency, formatDate } from '../utils/calculations';

interface EmailModalProps {
  isOpen: boolean;
  invoice: Invoice;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, invoice, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totals = calculateInvoiceTotals(invoice);
  const clientName = invoice.client?.name || invoice.client?.companyName || 'Valued Client';
  const companyName = invoice.business?.name || 'Our Company';

  const subject = `Invoice ${invoice.invoiceNumber} from ${companyName}`;

  const emailBody = `Hi ${clientName},

Please find attached Invoice ${invoice.invoiceNumber} for your review and payment.

INVOICE SUMMARY:
----------------------------------------
Invoice Number: ${invoice.invoiceNumber}
Issue Date:     ${formatDate(invoice.issueDate)}
Due Date:       ${formatDate(invoice.dueDate)}
Total Amount:   ${formatCurrency(totals.grandTotal, invoice.currency)}
Balance Due:    ${formatCurrency(totals.balanceDue, invoice.currency)}
----------------------------------------

PAYMENT INSTRUCTIONS:
Bank: ${invoice.bankInfo?.bankName || 'N/A'}
Account: ${invoice.bankInfo?.accountNumber || 'N/A'}
Routing/SWIFT: ${invoice.bankInfo?.routingNumber || invoice.bankInfo?.swiftBic || 'N/A'}
${invoice.bankInfo?.paymentUrl ? `Online Payment Link: ${invoice.bankInfo.paymentUrl}` : ''}

Thank you for your business! Please let us know if you have any questions.

Best regards,
${companyName}
${invoice.business?.email || ''}
${invoice.business?.website || ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(invoice.client?.email || '')}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Client Email Delivery Draft</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">To Email</label>
            <input
              type="text"
              readOnly
              value={invoice.client?.email || 'No email specified'}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 font-mono text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Subject</label>
            <input
              type="text"
              readOnly
              value={subject}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 font-semibold text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Message Body</label>
            <textarea
              readOnly
              rows={10}
              value={emailBody}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-3 font-mono text-xs text-slate-700 outline-none leading-relaxed resize-none"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Email Text'}</span>
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleOpenMailto}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Send className="w-4 h-4" /> Open in Mail App
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
