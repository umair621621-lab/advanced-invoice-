import React, { useState } from 'react';
import {
  Building2,
  User,
  Calendar,
  DollarSign,
  Plus,
  BookOpen,
  Image as ImageIcon,
  Palette,
  CreditCard,
  FileText,
  Percent,
  Truck,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import {
  AccentColor,
  CurrencyCode,
  FontStyle,
  Invoice,
  InvoiceItem,
  PaymentStatus,
  ThemeStyle
} from '../types';
import { CURRENCIES, calculateInvoiceTotals, calculateDueDateFromTerms, formatCurrency, convertInvoiceCurrency } from '../utils/calculations';
import { ItemRow } from './ItemRow';
import { CurrencyConverter } from './CurrencyConverter';

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (updated: Invoice) => void;
  onOpenLogoPicker: () => void;
  onOpenClients: () => void;
  onOpenCatalog: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onChange,
  onOpenLogoPicker,
  onOpenClients,
  onOpenCatalog,
}) => {
  const [activeSection, setActiveSection] = useState<'details' | 'items' | 'business' | 'client' | 'payment' | 'theme'>('items');

  const totals = calculateInvoiceTotals(invoice);

  // Helper updates
  const updateInvoice = (fields: Partial<Invoice>) => {
    onChange({
      ...invoice,
      ...fields,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateBusiness = (fields: Partial<typeof invoice.business>) => {
    onChange({
      ...invoice,
      business: { ...invoice.business, ...fields },
      updatedAt: new Date().toISOString(),
    });
  };

  const updateClient = (fields: Partial<typeof invoice.client>) => {
    onChange({
      ...invoice,
      client: { ...invoice.client, ...fields },
      updatedAt: new Date().toISOString(),
    });
  };

  const updateBank = (fields: Partial<typeof invoice.bankInfo>) => {
    onChange({
      ...invoice,
      bankInfo: { ...invoice.bankInfo, ...fields },
      updatedAt: new Date().toISOString(),
    });
  };

  const updateTheme = (fields: Partial<typeof invoice.theme>) => {
    onChange({
      ...invoice,
      theme: { ...invoice.theme, ...fields },
      updatedAt: new Date().toISOString(),
    });
  };

  // Line Item Handlers
  const handleUpdateItem = (id: string, updatedFields: Partial<InvoiceItem>) => {
    const updatedItems = invoice.items.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    updateInvoice({ items: updatedItems });
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length <= 1) {
      alert('An invoice requires at least one line item.');
      return;
    }
    const updatedItems = invoice.items.filter((item) => item.id !== id);
    updateInvoice({ items: updatedItems });
  };

  const handleDuplicateItem = (itemToDup: InvoiceItem) => {
    const newItem: InvoiceItem = {
      ...itemToDup,
      id: 'item_' + Date.now() + Math.random().toString(36).substr(2, 4),
      description: `${itemToDup.description} (Copy)`,
    };
    updateInvoice({ items: [...invoice.items, newItem] });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: 'item_' + Date.now() + Math.random().toString(36).substr(2, 4),
      description: '',
      details: '',
      quantity: 1,
      unitPrice: 100,
      discount: 0,
      discountType: 'percent',
      taxRate: invoice.taxRate || 0,
      taxable: true,
    };
    updateInvoice({ items: [...invoice.items, newItem] });
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newItems = [...invoice.items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    updateInvoice({ items: newItems });
  };

  const handleMoveDown = (index: number) => {
    if (index >= invoice.items.length - 1) return;
    const newItems = [...invoice.items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    updateInvoice({ items: newItems });
  };

  const handleTermsChange = (newTerms: string) => {
    const autoDueDate = calculateDueDateFromTerms(invoice.issueDate, newTerms);
    updateInvoice({
      paymentTerms: newTerms,
      dueDate: autoDueDate || invoice.dueDate,
    });
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Navigation Section Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSection('items')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'items'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Items ({invoice.items.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('details')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'details'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Meta & Totals</span>
        </button>

        <button
          onClick={() => setActiveSection('client')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'client'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Client Details</span>
        </button>

        <button
          onClick={() => setActiveSection('business')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'business'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>My Company</span>
        </button>

        <button
          onClick={() => setActiveSection('payment')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'payment'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Info</span>
        </button>

        <button
          onClick={() => setActiveSection('theme')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'theme'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme & Style</span>
        </button>
      </div>

      {/* SECTION 1: ITEMS TAB */}
      {activeSection === 'items' && (
        <div className="space-y-4">
          {/* Quick Currency Converter Toggle */}
          <CurrencyConverter
            invoice={invoice}
            onConvertInvoice={onChange}
            compact={true}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Invoice Line Items
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Add products or billable hours. Row totals update automatically.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenCatalog}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-200 shadow-sm transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Services Catalog</span>
              </button>

              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Row</span>
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {invoice.items.map((item, idx) => (
              <ItemRow
                key={item.id}
                item={item}
                index={idx}
                totalItems={invoice.items.length}
                currency={invoice.currency}
                showTaxColumn={invoice.theme?.showTaxColumn ?? true}
                showDiscountColumn={invoice.theme?.showDiscountColumn ?? true}
                onUpdate={handleUpdateItem}
                onRemove={handleRemoveItem}
                onDuplicate={handleDuplicateItem}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            ))}
          </div>

          {/* Quick Add Bottom Bar */}
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-3 border border-dashed border-slate-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Add another item row
          </button>
        </div>
      )}

      {/* SECTION 2: META & FINANCIAL TOTALS TAB */}
      {activeSection === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Invoice Identification Card */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Invoice Settings & Meta
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">PO Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. PO-9920"
                  value={invoice.poNumber || ''}
                  onChange={(e) => updateInvoice({ poNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payment Status</label>
                <select
                  value={invoice.status}
                  onChange={(e) => updateInvoice({ status: e.target.value as PaymentStatus })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none cursor-pointer"
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Currency</label>
                <select
                  value={invoice.currency}
                  onChange={(e) => {
                    const newCurrency = e.target.value as CurrencyCode;
                    const updated = convertInvoiceCurrency(invoice, newCurrency);
                    onChange(updated);
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none cursor-pointer"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol}) - {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Issue Date</label>
                <input
                  type="date"
                  value={invoice.issueDate}
                  onChange={(e) => updateInvoice({ issueDate: e.target.value })}
                  className="w-full px-2 py-2 text-xs border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payment Terms</label>
                <select
                  value={invoice.paymentTerms}
                  onChange={(e) => handleTermsChange(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none cursor-pointer"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 7">Net 7 Days</option>
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => updateInvoice({ dueDate: e.target.value })}
                  className="w-full px-2 py-2 text-xs border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Global Discount</label>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md p-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={invoice.globalDiscount}
                    onChange={(e) => updateInvoice({ globalDiscount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-transparent px-2 text-xs font-mono text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateInvoice({
                        globalDiscountType: invoice.globalDiscountType === 'percent' ? 'fixed' : 'percent',
                      })
                    }
                    className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold"
                  >
                    {invoice.globalDiscountType === 'percent' ? '%' : '$'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Global Tax Rate (%)</label>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md p-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={invoice.taxRate}
                    onChange={(e) => updateInvoice({ taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-transparent px-2 text-xs font-mono text-slate-900 outline-none"
                  />
                  <span className="text-slate-400 pr-2 text-xs">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Indigo Balance Due Summary Card (Exact Sleek Theme Pattern) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-5 bg-indigo-900 rounded-xl text-white shadow-lg shrink-0">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">Balance Due</p>
                  <h3 className="text-3xl font-bold">{totals.balanceDue}</h3>
                </div>
                <div className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-1 rounded font-bold uppercase">
                  {invoice.status}
                </div>
              </div>
              <div className="space-y-2 border-t border-slate-200 pt-4 text-slate-700">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-mono font-semibold text-slate-900">{formatCurrency(totals.subtotal, invoice.currency)}</span>
                </div>
                {invoice.globalDiscount > 0 && (
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Discount</span>
                    <span className="font-mono font-semibold text-rose-600">-{formatCurrency(totals.globalDiscountAmount, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-mono font-semibold text-slate-900">+{formatCurrency(totals.taxAmount, invoice.currency)}</span>
                </div>
                {invoice.shipping > 0 && (
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-mono font-semibold text-slate-900">+{formatCurrency(totals.shipping, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-200 mt-2 text-slate-900">
                  <span>Grand Total</span>
                  <span className="font-mono text-indigo-600 text-base">{formatCurrency(totals.grandTotal, invoice.currency)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Amount Paid Deposit</label>
              <input
                type="number"
                min="0"
                step="any"
                value={invoice.amountPaid}
                onChange={(e) => updateInvoice({ amountPaid: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono font-bold text-emerald-600 focus:bg-white focus:border-emerald-600 outline-none"
              />
            </div>

            <CurrencyConverter
              invoice={invoice}
              onConvertInvoice={onChange}
            />
          </div>

        </div>
      )}

      {/* SECTION 3: CLIENT DETAILS TAB */}
      {activeSection === 'client' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Client Details
            </h2>
            <button
              type="button"
              onClick={onOpenClients}
              className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-200 shadow-sm transition"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Saved Clients</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company / Organization Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={invoice.client.companyName}
                onChange={(e) => updateClient({ companyName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Person Name</label>
              <input
                type="text"
                placeholder="e.g. Jane Smith"
                value={invoice.client.name}
                onChange={(e) => updateClient({ name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Client Email</label>
              <input
                type="email"
                placeholder="billing@acme.com"
                value={invoice.client.email}
                onChange={(e) => updateClient({ email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={invoice.client.phone}
                onChange={(e) => updateClient({ phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tax ID / VAT #</label>
              <input
                type="text"
                placeholder="VAT-123456"
                value={invoice.client.taxId || ''}
                onChange={(e) => updateClient({ taxId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Billing Street Address</label>
              <input
                type="text"
                placeholder="123 Corporate Blvd"
                value={invoice.client.address}
                onChange={(e) => updateClient({ address: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City, State, Zip</label>
              <input
                type="text"
                placeholder="San Francisco, CA 94107"
                value={invoice.client.cityStateZip}
                onChange={(e) => updateClient({ cityStateZip: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: BUSINESS DETAILS TAB */}
      {activeSection === 'business' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Business Details
            </h2>
            <button
              type="button"
              onClick={onOpenLogoPicker}
              className="px-3 py-1 bg-white hover:bg-slate-50 text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 shadow-sm transition"
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{invoice.business.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company / Freelancer Name</label>
              <input
                type="text"
                value={invoice.business.name}
                onChange={(e) => updateBusiness({ name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tax ID / EIN / VAT #</label>
              <input
                type="text"
                placeholder="EIN: 12-3456789"
                value={invoice.business.taxId}
                onChange={(e) => updateBusiness({ taxId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Business Email</label>
              <input
                type="email"
                value={invoice.business.email}
                onChange={(e) => updateBusiness({ email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={invoice.business.phone}
                onChange={(e) => updateBusiness({ phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Website URL</label>
              <input
                type="text"
                value={invoice.business.website}
                onChange={(e) => updateBusiness({ website: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Street Address</label>
              <input
                type="text"
                value={invoice.business.address}
                onChange={(e) => updateBusiness({ address: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City, State, Zip</label>
              <input
                type="text"
                value={invoice.business.cityStateZip}
                onChange={(e) => updateBusiness({ cityStateZip: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: PAYMENT & BANK DETAILS TAB */}
      {activeSection === 'payment' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Bank Transfer & Payment Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chase Bank"
                  value={invoice.bankInfo.bankName}
                  onChange={(e) => updateBank({ bankName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Account Holder Name</label>
                <input
                  type="text"
                  placeholder="e.g. My Agency LLC"
                  value={invoice.bankInfo.accountName}
                  onChange={(e) => updateBank({ accountName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="•••• 1234"
                  value={invoice.bankInfo.accountNumber}
                  onChange={(e) => updateBank({ accountNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Routing / Sort Code</label>
                <input
                  type="text"
                  placeholder="123456789"
                  value={invoice.bankInfo.routingNumber}
                  onChange={(e) => updateBank({ routingNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SWIFT / BIC</label>
                <input
                  type="text"
                  placeholder="CHASUS33XXX"
                  value={invoice.bankInfo.swiftBic}
                  onChange={(e) => updateBank({ swiftBic: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">IBAN (International)</label>
                <input
                  type="text"
                  placeholder="US89 CHAS..."
                  value={invoice.bankInfo.iban}
                  onChange={(e) => updateBank({ iban: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">PayPal Email</label>
                <input
                  type="email"
                  placeholder="payments@mycompany.com"
                  value={invoice.bankInfo.paypalEmail || ''}
                  onChange={(e) => updateBank({ paypalEmail: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Custom Payment URL (Stripe/PayPal Link)</label>
              <input
                type="url"
                placeholder="https://pay.stripe.com/..."
                value={invoice.bankInfo.paymentUrl || ''}
                onChange={(e) => updateBank({ paymentUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-md font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          {/* Notes & Terms Text Fields */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Invoice Terms & Notes
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payment Terms Text</label>
              <textarea
                rows={2}
                value={invoice.terms}
                onChange={(e) => updateInvoice({ terms: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-100 bg-slate-50 rounded-md text-slate-900 outline-none focus:bg-white focus:border-indigo-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Thank You Note / Client Message</label>
              <textarea
                rows={2}
                value={invoice.notes}
                onChange={(e) => updateInvoice({ notes: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-100 bg-slate-50 rounded-md text-slate-900 outline-none focus:bg-white focus:border-indigo-600 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: THEME & STYLE TAB */}
      {activeSection === 'theme' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            Template Layout & Visual Styling
          </h2>

          {/* Style Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Invoice Style Theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'modern', name: 'Modern Executive' },
                { id: 'minimal', name: 'Minimal Slate' },
                { id: 'classic', name: 'Classic Elegance' },
                { id: 'vibrant', name: 'Creative Gradient' },
                { id: 'corporate', name: 'Corporate Grid' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => updateTheme({ style: st.id as ThemeStyle })}
                  className={`p-2.5 rounded-lg border text-xs font-semibold transition text-center ${
                    invoice.theme?.style === st.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Picker */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Primary Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'indigo', color: 'bg-indigo-600' },
                { id: 'slate', color: 'bg-slate-900' },
                { id: 'emerald', color: 'bg-emerald-600' },
                { id: 'blue', color: 'bg-blue-600' },
                { id: 'violet', color: 'bg-violet-600' },
                { id: 'rose', color: 'bg-rose-600' },
                { id: 'amber', color: 'bg-amber-600' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => updateTheme({ accentColor: acc.id as AccentColor })}
                  className={`w-8 h-8 rounded-full ${acc.color} border-2 transition ${
                    invoice.theme?.accentColor === acc.id ? 'border-indigo-600 scale-110 shadow-md ring-2 ring-indigo-200' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  title={acc.id}
                />
              ))}
            </div>
          </div>

          {/* Typography Pairings */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Font Style Family</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sans', name: 'Sans-Serif Modern' },
                { id: 'serif', name: 'Editorial Serif' },
                { id: 'mono', name: 'Tech Monospace' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => updateTheme({ fontStyle: f.id as FontStyle })}
                  className={`p-2 rounded-lg border text-xs font-medium transition ${
                    invoice.theme?.fontStyle === f.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Element Display Toggles */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Visibility Options</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { key: 'showLogo', label: 'Display Logo' },
                { key: 'showTaxColumn', label: 'Display Item Tax' },
                { key: 'showDiscountColumn', label: 'Display Item Discounts' },
                { key: 'showItemDetails', label: 'Display Line Item Details' },
                { key: 'showPaymentInfo', label: 'Display Bank Wire Details' },
                { key: 'showSignatureBlock', label: 'Display Signature Line' },
                { key: 'showNotes', label: 'Display Notes & Terms' },
              ].map((toggle) => {
                const isChecked = Boolean(invoice.theme?.[toggle.key as keyof typeof invoice.theme]);
                return (
                  <label
                    key={toggle.key}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => updateTheme({ [toggle.key]: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0"
                    />
                    <span className="text-slate-700 font-medium">{toggle.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Custom Print Footer Line</label>
            <input
              type="text"
              placeholder="e.g. Thank you for your business! • www.company.com"
              value={invoice.theme?.customFooterNote || ''}
              onChange={(e) => updateTheme({ customFooterNote: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
            />
          </div>

        </div>
      )}

    </div>
  );
};
