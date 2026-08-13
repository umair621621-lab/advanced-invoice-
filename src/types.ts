export type PaymentStatus = 'Draft' | 'Pending' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'CHF' | 'SGD' | 'AED' | 'BRL';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimals: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  discount: number; // Amount or percentage depending on item discount type
  discountType: 'fixed' | 'percent';
  taxRate: number; // percentage
  taxable: boolean;
}

export interface BusinessInfo {
  name: string;
  logoUrl?: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  cityStateZip: string;
  country: string;
  taxId: string; // VAT / EIN / Tax registration number
}

export interface ClientInfo {
  id?: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  country: string;
  taxId?: string;
}

export interface BankInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string; // Routing / IFSC / Sort Code
  swiftBic: string;
  iban: string;
  paypalEmail?: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
}

export type ThemeStyle = 'modern' | 'minimal' | 'classic' | 'vibrant' | 'corporate';
export type AccentColor = 'indigo' | 'slate' | 'emerald' | 'blue' | 'violet' | 'rose' | 'amber';
export type FontStyle = 'sans' | 'serif' | 'mono';

export interface InvoiceTheme {
  style: ThemeStyle;
  accentColor: AccentColor;
  fontStyle: FontStyle;
  showLogo: boolean;
  showTaxColumn: boolean;
  showDiscountColumn: boolean;
  showItemDetails: boolean;
  showPaymentInfo: boolean;
  showSignatureBlock: boolean;
  showNotes: boolean;
  customFooterNote?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poNumber?: string;
  status: PaymentStatus;
  issueDate: string;
  dueDate: string;
  paymentTerms: string; // e.g. "Net 30", "Due on Receipt"
  currency: CurrencyCode;
  
  business: BusinessInfo;
  client: ClientInfo;
  items: InvoiceItem[];

  // Global calculations
  globalDiscount: number;
  globalDiscountType: 'fixed' | 'percent';
  taxRate: number; // Global tax rate in percent
  taxType: 'global' | 'per_item';
  shipping: number;
  amountPaid: number;

  bankInfo: BankInfo;
  notes: string;
  terms: string;
  theme: InvoiceTheme;

  createdAt: string;
  updatedAt: string;
}

export interface SavedCatalogItem {
  id: string;
  title: string;
  description: string;
  unitPrice: number;
  taxRate: number;
}
