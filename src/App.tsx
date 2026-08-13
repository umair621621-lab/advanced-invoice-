import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { LogoPickerModal } from './components/LogoPickerModal';
import { ClientManagerModal } from './components/ClientManagerModal';
import { CatalogManagerModal } from './components/CatalogManagerModal';
import { InvoiceHistoryModal } from './components/InvoiceHistoryModal';
import { EmailModal } from './components/EmailModal';
import { PrintModal } from './components/PrintModal';
import {
  ClientInfo,
  Invoice,
  SavedCatalogItem
} from './types';
import {
  INITIAL_INVOICE,
  SAMPLE_CATALOG,
  SAMPLE_CLIENTS,
  SAMPLE_LOGOS
} from './data/defaults';
import { generateInvoiceNumber } from './utils/calculations';

const STORAGE_KEYS = {
  CURRENT_INVOICE: 'invoice_gen_current_v2',
  HISTORY: 'invoice_gen_history_v2',
  CLIENTS: 'invoice_gen_clients_v2',
  CATALOG: 'invoice_gen_catalog_v2',
};

export default function App() {
  // Main state
  const [invoice, setInvoice] = useState<Invoice>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_INVOICE);
      return saved ? JSON.parse(saved) : INITIAL_INVOICE;
    } catch {
      return INITIAL_INVOICE;
    }
  });

  const [history, setHistory] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [INITIAL_INVOICE];
    } catch {
      return [INITIAL_INVOICE];
    }
  });

  const [savedClients, setSavedClients] = useState<ClientInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : SAMPLE_CLIENTS;
    } catch {
      return SAMPLE_CLIENTS;
    }
  });

  const [catalogItems, setCatalogItems] = useState<SavedCatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATALOG);
      return saved ? JSON.parse(saved) : SAMPLE_CATALOG;
    } catch {
      return SAMPLE_CATALOG;
    }
  });

  // UI state
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_INVOICE, JSON.stringify(invoice));
    } catch (e) {
      console.warn('Could not save current invoice to localStorage', e);
    }
  }, [invoice]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save invoice history to localStorage', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(savedClients));
    } catch (e) {
      console.warn('Could not save clients to localStorage', e);
    }
  }, [savedClients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(catalogItems));
    } catch (e) {
      console.warn('Could not save catalog items to localStorage', e);
    }
  }, [catalogItems]);

  // Invoice change & history auto-save handler
  const handleInvoiceChange = (updated: Invoice) => {
    setInvoice(updated);
    // Update or insert into history
    setHistory((prev) => {
      const exists = prev.some((inv) => inv.id === updated.id);
      if (exists) {
        return prev.map((inv) => (inv.id === updated.id ? updated : inv));
      } else {
        return [updated, ...prev];
      }
    });
  };

  // Create brand new blank invoice
  const handleNewInvoice = () => {
    const newId = 'inv_' + Date.now();
    const newInvNum = generateInvoiceNumber(history.length);
    const newInv: Invoice = {
      ...INITIAL_INVOICE,
      id: newId,
      invoiceNumber: newInvNum,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: [
        {
          id: 'item_1',
          description: 'Consulting & Technical Services',
          details: 'Scope of work details...',
          quantity: 1,
          unitPrice: 500,
          discount: 0,
          discountType: 'percent',
          taxRate: 0,
          taxable: true,
        },
      ],
      amountPaid: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoice(newInv);
    setHistory((prev) => [newInv, ...prev]);
  };

  // Load preset sample templates
  const handleLoadPreset = (type: string) => {
    if (type === 'freelance') {
      setInvoice(INITIAL_INVOICE);
    } else if (type === 'agency') {
      const agencyInv: Invoice = {
        ...INITIAL_INVOICE,
        id: 'inv_agency_' + Date.now(),
        invoiceNumber: 'INV-EUR-2026',
        currency: 'EUR',
        business: {
          ...INITIAL_INVOICE.business,
          name: 'Lumina Digital Agency B.V.',
          logoUrl: SAMPLE_LOGOS[1].svg,
          address: 'Keizersgracht 421',
          cityStateZip: '1016 EK Amsterdam',
          country: 'Netherlands',
          taxId: 'NL-88291023B01',
        },
        client: SAMPLE_CLIENTS[1],
        items: [
          {
            id: 'item_ag_1',
            description: 'Custom Mobile App Development (iOS & Android)',
            details: 'React Native app development, Firebase push notifications, and App Store submission.',
            quantity: 80,
            unitPrice: 110,
            discount: 5,
            discountType: 'percent',
            taxRate: 21,
            taxable: true,
          },
          {
            id: 'item_ag_2',
            description: 'Backend GraphQL Microservice API',
            details: 'Node.js GraphQL server, Redis caching, PostgreSQL database setup.',
            quantity: 40,
            unitPrice: 125,
            discount: 0,
            discountType: 'fixed',
            taxRate: 21,
            taxable: true,
          },
        ],
        taxRate: 21,
        theme: {
          ...INITIAL_INVOICE.theme,
          style: 'vibrant',
          accentColor: 'blue',
        },
      };
      handleInvoiceChange(agencyInv);
    } else if (type === 'consulting') {
      const consultingInv: Invoice = {
        ...INITIAL_INVOICE,
        id: 'inv_consult_' + Date.now(),
        invoiceNumber: 'INV-UK-8821',
        currency: 'GBP',
        business: {
          ...INITIAL_INVOICE.business,
          name: 'Crest Business Strategy Ltd',
          logoUrl: SAMPLE_LOGOS[2].svg,
          address: '25 Bank Street, Canary Wharf',
          cityStateZip: 'London E14 5JP',
          country: 'United Kingdom',
          taxId: 'GB-VAT-992019',
        },
        client: SAMPLE_CLIENTS[1],
        items: [
          {
            id: 'item_cs_1',
            description: 'Executive Technology & Security Audit',
            details: 'Comprehensive infrastructure review, penetration testing summary, and compliance roadmap.',
            quantity: 1,
            unitPrice: 3500,
            discount: 250,
            discountType: 'fixed',
            taxRate: 20,
            taxable: true,
          },
          {
            id: 'item_cs_2',
            description: 'Retainer - CTO Advisory Services',
            details: 'Monthly 15 hours executive advisory, technical team mentoring, and architecture review.',
            quantity: 1,
            unitPrice: 2000,
            discount: 0,
            discountType: 'fixed',
            taxRate: 20,
            taxable: true,
          },
        ],
        taxRate: 20,
        theme: {
          ...INITIAL_INVOICE.theme,
          style: 'corporate',
          accentColor: 'emerald',
        },
      };
      handleInvoiceChange(consultingInv);
    }
  };

  // Trigger Native Browser Print
  const handleTriggerPrint = () => {
    setIsPrintModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Save current client to directory
  const handleSaveCurrentClient = () => {
    if (!invoice.client?.companyName && !invoice.client?.name) {
      alert('Please fill in client name or company name first.');
      return;
    }
    const newClient: ClientInfo = {
      ...invoice.client,
      id: 'client_' + Date.now(),
    };
    setSavedClients((prev) => [newClient, ...prev]);
  };

  // Save catalog item
  const handleAddCatalogItem = (newItemData: Omit<SavedCatalogItem, 'id'>) => {
    const item: SavedCatalogItem = {
      ...newItemData,
      id: 'cat_' + Date.now(),
    };
    setCatalogItems((prev) => [item, ...prev]);
  };

  // JSON Export / Import
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(invoice, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${invoice.invoiceNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target?.result as string);
            if (parsed && parsed.invoiceNumber && parsed.items) {
              handleInvoiceChange(parsed);
              alert('Invoice loaded successfully from JSON!');
            } else {
              alert('Invalid invoice JSON format.');
            }
          } catch {
            alert('Failed to parse JSON file.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* Top Header Navbar */}
      <Header
        invoice={invoice}
        viewMode={viewMode}
        setViewMode={setViewMode}
        savedCount={history.length}
        onNewInvoice={handleNewInvoice}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenClients={() => setIsClientModalOpen(true)}
        onOpenCatalog={() => setIsCatalogModalOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
        onPrintPDF={() => setIsPrintModalOpen(true)}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onLoadPreset={handleLoadPreset}
        onConvertInvoice={handleInvoiceChange}
      />

      {/* Main Container Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        
        {viewMode === 'split' ? (
          /* Desktop Split View: Form on Left, Live Preview on Right */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Form */}
            <div className="lg:col-span-6 space-y-6">
              <InvoiceForm
                invoice={invoice}
                onChange={handleInvoiceChange}
                onOpenLogoPicker={() => setIsLogoModalOpen(true)}
                onOpenClients={() => setIsClientModalOpen(true)}
                onOpenCatalog={() => setIsCatalogModalOpen(true)}
              />
            </div>

            {/* Right Column: Sticky Live Invoice Preview */}
            <div className="lg:col-span-6 sticky top-20">
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Invoice Output
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExportJSON}
                      className="text-[11px] text-slate-500 hover:text-slate-900 underline font-medium"
                    >
                      Export JSON
                    </button>
                    <button
                      onClick={() => setIsPrintModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                    >
                      Expand PDF
                    </button>
                  </div>
                </div>

                <div className="max-h-[calc(100vh-140px)] overflow-y-auto pr-1 rounded-xl">
                  <InvoicePreview invoice={invoice} />
                </div>
              </div>
            </div>

          </div>
        ) : viewMode === 'edit' ? (
          /* Single Edit Form View */
          <div className="max-w-4xl mx-auto">
            <InvoiceForm
              invoice={invoice}
              onChange={handleInvoiceChange}
              onOpenLogoPicker={() => setIsLogoModalOpen(true)}
              onOpenClients={() => setIsClientModalOpen(true)}
              onOpenCatalog={() => setIsCatalogModalOpen(true)}
            />
          </div>
        ) : (
          /* Single Preview View */
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Full Page Preview
              </span>
              <button
                onClick={handleTriggerPrint}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow hover:bg-indigo-500"
              >
                Print / Save PDF
              </button>
            </div>
            <InvoicePreview invoice={invoice} />
          </div>
        )}

      </main>

      {/* Hidden container for global native window.print() */}
      <div className="hidden print:block">
        <InvoicePreview invoice={invoice} isPrintView={true} />
      </div>

      {/* MODALS */}
      <LogoPickerModal
        isOpen={isLogoModalOpen}
        currentLogoUrl={invoice.business.logoUrl}
        onClose={() => setIsLogoModalOpen(false)}
        onSelectLogo={(logoUrl) => {
          handleInvoiceChange({
            ...invoice,
            business: { ...invoice.business, logoUrl },
          });
        }}
      />

      <ClientManagerModal
        isOpen={isClientModalOpen}
        savedClients={savedClients}
        currentClient={invoice.client}
        onClose={() => setIsClientModalOpen(false)}
        onSelectClient={(client) => {
          handleInvoiceChange({
            ...invoice,
            client,
          });
        }}
        onSaveCurrentClient={handleSaveCurrentClient}
        onDeleteClient={(id) => {
          setSavedClients((prev) => prev.filter((c) => c.id !== id));
        }}
      />

      <CatalogManagerModal
        isOpen={isCatalogModalOpen}
        catalogItems={catalogItems}
        currency={invoice.currency}
        onClose={() => setIsCatalogModalOpen(false)}
        onAddItemToInvoice={(catItem) => {
          const newItem = {
            id: 'item_' + Date.now() + Math.random().toString(36).substr(2, 4),
            description: catItem.title,
            details: catItem.description,
            quantity: 1,
            unitPrice: catItem.unitPrice,
            discount: 0,
            discountType: 'percent' as const,
            taxRate: catItem.taxRate || 0,
            taxable: true,
          };
          handleInvoiceChange({
            ...invoice,
            items: [...invoice.items, newItem],
          });
          setIsCatalogModalOpen(false);
        }}
        onAddNewCatalogItem={handleAddCatalogItem}
        onDeleteCatalogItem={(id) => {
          setCatalogItems((prev) => prev.filter((c) => c.id !== id));
        }}
      />

      <InvoiceHistoryModal
        isOpen={isHistoryModalOpen}
        history={history}
        currentInvoiceId={invoice.id}
        onClose={() => setIsHistoryModalOpen(false)}
        onLoadInvoice={(loadedInv) => {
          setInvoice(loadedInv);
        }}
        onDuplicateInvoice={(dupInv) => {
          const newInv: Invoice = {
            ...dupInv,
            id: 'inv_' + Date.now(),
            invoiceNumber: generateInvoiceNumber(history.length),
            issueDate: new Date().toISOString().split('T')[0],
            status: 'Draft',
          };
          handleInvoiceChange(newInv);
        }}
        onDeleteInvoice={(id) => {
          setHistory((prev) => prev.filter((i) => i.id !== id));
        }}
        onClearHistory={() => setHistory([])}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        invoice={invoice}
        onClose={() => setIsEmailModalOpen(false)}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        invoice={invoice}
        onClose={() => setIsPrintModalOpen(false)}
        onPrint={handleTriggerPrint}
      />

    </div>
  );
}
