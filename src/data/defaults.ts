import { ClientInfo, Invoice, SavedCatalogItem } from '../types';

export const SAMPLE_LOGOS = [
  {
    id: 'tech_nexus',
    name: 'Tech Nexus',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%234f46e5"/><path d="M30 30h40v12H42v14h24v12H42v18H30V30z" fill="white"/></svg>`,
  },
  {
    id: 'studio_vertex',
    name: 'Studio Vertex',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%230284c7"/><circle cx="50" cy="50" r="28" stroke="white" stroke-width="8" fill="none"/><path d="M50 22v56" stroke="white" stroke-width="8" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'crest_agency',
    name: 'Crest Agency',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23059669"/><path d="M25 65 L50 25 L75 65 Z" fill="none" stroke="white" stroke-width="8" stroke-linejoin="round"/><circle cx="50" cy="52" r="6" fill="white"/></svg>`,
  },
  {
    id: 'monarch_consulting',
    name: 'Monarch Gold',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23d97706"/><path d="M25 35 L50 20 L75 35 L75 75 L50 85 L25 75 Z" fill="none" stroke="white" stroke-width="6"/><path d="M35 45 L50 35 L65 45" fill="none" stroke="white" stroke-width="5"/></svg>`,
  },
];

export const SAMPLE_CLIENTS: ClientInfo[] = [
  {
    id: 'client_acme',
    name: 'Sarah Jenkins',
    companyName: 'Acme Global Innovations',
    email: 'accounts@acmeglobal.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Suite 400',
    cityStateZip: 'San Francisco, CA 94107',
    country: 'United States',
    taxId: 'US-VAT-987654321',
  },
  {
    id: 'client_lumina',
    name: 'Marcus Vance',
    companyName: 'Lumina Digital Media',
    email: 'marcus@luminamedia.co.uk',
    phone: '+44 20 7946 0912',
    address: '12 Oxford Street, Soho',
    cityStateZip: 'London W1D 1BS',
    country: 'United Kingdom',
    taxId: 'GB-VAT-123456789',
  },
  {
    id: 'client_starlight',
    name: 'Elena Rostova',
    companyName: 'Starlight Tech Labs',
    email: 'billing@starlightlabs.io',
    phone: '+1 (415) 890-1122',
    address: '100 Innovation Way, Tower B',
    cityStateZip: 'Austin, TX 78701',
    country: 'United States',
    taxId: 'TX-TAX-554433',
  },
];

export const SAMPLE_CATALOG: SavedCatalogItem[] = [
  {
    id: 'cat_1',
    title: 'UI/UX Design & Wireframing',
    description: 'High-fidelity Figma prototypes, design system components, and desktop/mobile user journeys.',
    unitPrice: 120,
    taxRate: 10,
  },
  {
    id: 'cat_2',
    title: 'Full-Stack Web Development',
    description: 'Frontend React/Tailwind integration, RESTful API endpoints, and database architecture.',
    unitPrice: 150,
    taxRate: 10,
  },
  {
    id: 'cat_3',
    title: 'Brand Identity & Guidelines',
    description: 'Logo package, color palette spec, typography rules, and vector asset export bundle.',
    unitPrice: 1200,
    taxRate: 10,
  },
  {
    id: 'cat_4',
    title: 'Cloud DevOps & Infrastructure Support',
    description: 'Serverless deployment setup, SSL configuration, domain setup, and automated backup pipeline.',
    unitPrice: 95,
    taxRate: 10,
  },
  {
    id: 'cat_5',
    title: 'SEO Audit & Performance Tuning',
    description: 'PageSpeed optimization, core web vitals tuning, metadata schema, and accessibility fixes.',
    unitPrice: 850,
    taxRate: 10,
  },
];

export const INITIAL_INVOICE: Invoice = {
  id: 'inv_demo_01',
  invoiceNumber: 'INV-2026-001',
  poNumber: 'PO-8821-X',
  status: 'Pending',
  issueDate: '2026-08-10',
  dueDate: '2026-09-09',
  paymentTerms: 'Net 30',
  currency: 'USD',

  business: {
    name: 'Apex Design & Development Studio',
    logoUrl: SAMPLE_LOGOS[0].svg,
    email: 'billing@apexstudio.io',
    phone: '+1 (555) 019-2831',
    website: 'https://apexstudio.io',
    address: '450 Mission Street, Floor 12',
    cityStateZip: 'San Francisco, CA 94105',
    country: 'United States',
    taxId: 'EIN: 94-3829102',
  },

  client: SAMPLE_CLIENTS[0],

  items: [
    {
      id: 'item_1',
      description: 'E-Commerce Platform Redesign - Phase 1',
      details: 'UX discovery, wireframing, interactive Figma prototype, and component library design.',
      quantity: 40,
      unitPrice: 120,
      discount: 10, // 10%
      discountType: 'percent',
      taxRate: 8.5,
      taxable: true,
    },
    {
      id: 'item_2',
      description: 'Custom React & Tailwind Integration',
      details: 'Responsive frontend build, state management, shopping cart integration, and performance tuning.',
      quantity: 35,
      unitPrice: 150,
      discount: 0,
      discountType: 'fixed',
      taxRate: 8.5,
      taxable: true,
    },
    {
      id: 'item_3',
      description: 'Payment Gateway & Checkout API Integration',
      details: 'Secure Stripe Connect integration, webhook event listener, and automated receipt triggers.',
      quantity: 1,
      unitPrice: 1250,
      discount: 150, // $150 fixed
      discountType: 'fixed',
      taxRate: 8.5,
      taxable: true,
    },
    {
      id: 'item_4',
      description: 'Dedicated Cloud Hosting & SSL Setup',
      details: 'Annual Cloud Run provisioning, custom domain routing, and automated daily database snapshots.',
      quantity: 1,
      unitPrice: 350,
      discount: 0,
      discountType: 'fixed',
      taxRate: 0,
      taxable: false,
    },
  ],

  globalDiscount: 0,
  globalDiscountType: 'fixed',
  taxRate: 8.5,
  taxType: 'global',
  shipping: 50,
  amountPaid: 2000,

  bankInfo: {
    bankName: 'Silicon Valley National Bank',
    accountName: 'Apex Design Studio LLC',
    accountNumber: '•••• 8829',
    routingNumber: '121000358',
    swiftBic: 'SVNBUS33XXX',
    iban: 'US89 SVNB 1210 0035 8829 01',
    paypalEmail: 'payments@apexstudio.io',
    paymentUrl: 'https://pay.stripe.com/apex-inv-2026-001',
  },

  notes: 'Thank you for partnering with Apex Studio! We appreciate your business and look forward to Phase 2.',
  terms: 'Payment is due within 30 days of issue date. Please reference Invoice #INV-2026-001 in bank wire transfers. Late payments subject to a 1.5% monthly service charge.',

  theme: {
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
    customFooterNote: 'Apex Design & Development Studio LLC • www.apexstudio.io',
  },

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
