import React, { useState } from 'react';
import { X, Users, Plus, Check, Trash2, Building2, UserCheck } from 'lucide-react';
import { ClientInfo } from '../types';

interface ClientManagerModalProps {
  isOpen: boolean;
  savedClients: ClientInfo[];
  currentClient: ClientInfo;
  onClose: () => void;
  onSelectClient: (client: ClientInfo) => void;
  onSaveCurrentClient: () => void;
  onDeleteClient: (id: string) => void;
}

export const ClientManagerModal: React.FC<ClientManagerModalProps> = ({
  isOpen,
  savedClients,
  currentClient,
  onClose,
  onSelectClient,
  onSaveCurrentClient,
  onDeleteClient,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Saved Clients Directory</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Client Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Selected Client</span>
            <span className="text-sm font-bold text-slate-900">
              {currentClient.companyName || currentClient.name || 'No Client Set'}
            </span>
            <span className="text-xs text-slate-500 block">{currentClient.email || 'No email provided'}</span>
          </div>
          <button
            onClick={() => {
              onSaveCurrentClient();
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Save Current
          </button>
        </div>

        {/* Saved Clients List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <span className="text-xs font-semibold text-slate-500 block">Saved Client Templates ({savedClients.length})</span>
          {savedClients.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No saved clients yet. Click "Save Current" above to save client info for future invoices.
            </div>
          ) : (
            savedClients.map((client) => {
              const isSelected = client.id === currentClient.id || client.email === currentClient.email;
              return (
                <div
                  key={client.id || client.email}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-500'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {client.companyName || client.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Contact: {client.name} • {client.email}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {[client.address, client.cityStateZip, client.country].filter(Boolean).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectClient(client);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      {isSelected ? 'Active' : 'Apply'}
                    </button>
                    {client.id && (
                      <button
                        onClick={() => onDeleteClient(client.id!)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition"
                        title="Delete client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
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
