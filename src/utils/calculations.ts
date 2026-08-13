import { CurrencyCode, CurrencyConfig, Invoice, InvoiceItem } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimals: 2 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', decimals: 2 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimals: 2 },
};

export const MAJOR_CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];

export const DEFAULT_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  JPY: 155.0,
  AUD: 1.52,
  INR: 83.5,
  CHF: 0.90,
  SGD: 1.35,
  AED: 3.67,
  BRL: 5.45,
};

export function getExchangeRate(from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return 1;
  const fromRate = DEFAULT_EXCHANGE_RATES[from] || 1;
  const toRate = DEFAULT_EXCHANGE_RATES[to] || 1;
  return toRate / fromRate;
}

export function convertInvoiceCurrency(
  invoice: Invoice,
  targetCurrency: CurrencyCode,
  customRate?: number
): Invoice {
  if (invoice.currency === targetCurrency && customRate === undefined) {
    return invoice;
  }

  const rate = customRate !== undefined && customRate > 0
    ? customRate
    : getExchangeRate(invoice.currency, targetCurrency);

  const targetDecimals = CURRENCIES[targetCurrency]?.decimals ?? 2;

  const convertedItems: InvoiceItem[] = (invoice.items || []).map((item) => {
    const rawPrice = (item.unitPrice || 0) * rate;
    const unitPrice = Number(rawPrice.toFixed(targetDecimals));

    let discount = item.discount;
    if (item.discountType === 'fixed' && item.discount > 0) {
      discount = Number((item.discount * rate).toFixed(targetDecimals));
    }

    return {
      ...item,
      unitPrice,
      discount,
    };
  });

  let globalDiscount = invoice.globalDiscount;
  if (invoice.globalDiscountType === 'fixed' && invoice.globalDiscount > 0) {
    globalDiscount = Number((invoice.globalDiscount * rate).toFixed(targetDecimals));
  }

  let shipping = invoice.shipping;
  if (invoice.shipping > 0) {
    shipping = Number((invoice.shipping * rate).toFixed(targetDecimals));
  }

  let amountPaid = invoice.amountPaid;
  if (invoice.amountPaid > 0) {
    amountPaid = Number((invoice.amountPaid * rate).toFixed(targetDecimals));
  }

  return {
    ...invoice,
    currency: targetCurrency,
    items: convertedItems,
    globalDiscount,
    shipping,
    amountPaid,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Calculates line total for a single item.
 * Line Total = (Quantity × Unit Price) − Item Discount
 */
export function calculateLineTotal(item: InvoiceItem): number {
  const qty = Math.max(0, Number(item.quantity) || 0);
  const price = Math.max(0, Number(item.unitPrice) || 0);
  const basePrice = qty * price;

  let itemDiscountAmount = 0;
  if (item.discountType === 'percent') {
    const discPercent = Math.min(100, Math.max(0, Number(item.discount) || 0));
    itemDiscountAmount = (basePrice * discPercent) / 100;
  } else {
    itemDiscountAmount = Math.max(0, Number(item.discount) || 0);
  }

  const total = Math.max(0, basePrice - itemDiscountAmount);
  return Number(total.toFixed(2));
}

export interface InvoiceFinancialSummary {
  subtotal: number;
  itemDiscountsTotal: number;
  globalDiscountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  shipping: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  isFullyPaid: boolean;
  isOverpaid: boolean;
}

/**
 * Calculates complete financial breakdown for an invoice.
 */
export function calculateInvoiceTotals(invoice: Invoice): InvoiceFinancialSummary {
  const items = invoice.items || [];
  
  // 1. Calculate line totals & subtotal
  let subtotal = 0;
  let itemDiscountsTotal = 0;

  items.forEach((item) => {
    const qty = Math.max(0, Number(item.quantity) || 0);
    const price = Math.max(0, Number(item.unitPrice) || 0);
    const grossLine = qty * price;

    let itemDisc = 0;
    if (item.discountType === 'percent') {
      const discPercent = Math.min(100, Math.max(0, Number(item.discount) || 0));
      itemDisc = (grossLine * discPercent) / 100;
    } else {
      itemDisc = Math.max(0, Number(item.discount) || 0);
    }
    
    itemDiscountsTotal += itemDisc;
    const lineTotal = Math.max(0, grossLine - itemDisc);
    subtotal += lineTotal;
  });

  // 2. Global Discount
  let globalDiscountAmount = 0;
  if (invoice.globalDiscountType === 'percent') {
    const globalPercent = Math.min(100, Math.max(0, Number(invoice.globalDiscount) || 0));
    globalDiscountAmount = (subtotal * globalPercent) / 100;
  } else {
    globalDiscountAmount = Math.max(0, Number(invoice.globalDiscount) || 0);
  }
  globalDiscountAmount = Math.min(subtotal, globalDiscountAmount);

  const discountedSubtotal = Math.max(0, subtotal - globalDiscountAmount);

  // 3. Tax calculation
  let taxAmount = 0;
  if (invoice.taxType === 'per_item') {
    // Sum item specific taxes
    items.forEach((item) => {
      if (item.taxable !== false) {
        const lineVal = calculateLineTotal(item);
        const rate = Math.max(0, Number(item.taxRate) || 0);
        taxAmount += (lineVal * rate) / 100;
      }
    });
  } else {
    // Global tax rate on discounted subtotal
    const taxRate = Math.max(0, Number(invoice.taxRate) || 0);
    taxAmount = (discountedSubtotal * taxRate) / 100;
  }

  // 4. Shipping / Additional Charges
  const shipping = Math.max(0, Number(invoice.shipping) || 0);

  // 5. Grand Total = Subtotal - Global Discount + Tax + Shipping
  const grandTotal = Math.max(0, discountedSubtotal + taxAmount + shipping);

  // 6. Balance Due = Grand Total - Amount Paid
  const amountPaid = Math.max(0, Number(invoice.amountPaid) || 0);
  const rawBalance = grandTotal - amountPaid;
  const balanceDue = rawBalance < 0.001 ? 0 : rawBalance;

  const isFullyPaid = amountPaid >= grandTotal && grandTotal > 0;
  const isOverpaid = amountPaid > grandTotal;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    itemDiscountsTotal: Number(itemDiscountsTotal.toFixed(2)),
    globalDiscountAmount: Number(globalDiscountAmount.toFixed(2)),
    taxableAmount: Number(discountedSubtotal.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    amountPaid: Number(amountPaid.toFixed(2)),
    balanceDue: Number(balanceDue.toFixed(2)),
    isFullyPaid,
    isOverpaid,
  };
}

/**
 * Formats a currency number safely according to selected currency code.
 */
export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'USD'): string {
  const cfg = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const safeAmount = isNaN(amount) ? 0 : amount;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cfg.code,
      minimumFractionDigits: cfg.decimals,
      maximumFractionDigits: cfg.decimals,
    }).format(safeAmount);
  } catch {
    return `${cfg.symbol}${safeAmount.toFixed(cfg.decimals)}`;
  }
}

/**
 * Formats date string to legible format e.g. "Aug 15, 2026"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Calculates due date based on payment terms preset (e.g. Net 30, Due on Receipt)
 */
export function calculateDueDateFromTerms(issueDateStr: string, terms: string): string {
  if (!issueDateStr) return '';
  const date = new Date(issueDateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return issueDateStr;

  let days = 0;
  if (terms.includes('15')) days = 15;
  else if (terms.includes('30')) days = 30;
  else if (terms.includes('60')) days = 60;
  else if (terms.includes('90')) days = 90;
  else if (terms.includes('7')) days = 7;

  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Generate unique invoice number, e.g. INV-2026-001
 */
export function generateInvoiceNumber(existingCount = 0): string {
  const year = new Date().getFullYear();
  const num = (existingCount + 1).toString().padStart(3, '0');
  return `INV-${year}-${num}`;
}
