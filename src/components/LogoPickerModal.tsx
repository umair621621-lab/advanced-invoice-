import React, { useState } from 'react';
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { SAMPLE_LOGOS } from '../data/defaults';

interface LogoPickerModalProps {
  isOpen: boolean;
  currentLogoUrl?: string;
  onClose: () => void;
  onSelectLogo: (logoUrl: string) => void;
}

export const LogoPickerModal: React.FC<LogoPickerModalProps> = ({
  isOpen,
  currentLogoUrl,
  onClose,
  onSelectLogo,
}) => {
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectLogo(event.target.result as string);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-6 shadow-2xl text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Upload Company Logo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Drag / Drop Upload */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 block">
            Upload Logo File (PNG, JPG, SVG, WebP)
          </label>
          <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center group">
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition mb-2" />
            <span className="text-sm font-medium text-slate-700">
              Click to browse or drag and drop logo image
            </span>
            <span className="text-xs text-slate-400 mt-1">Recommended size: 300x300px or vector SVG</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Image URL Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 block">Or enter Image URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-md px-3 py-2 text-sm outline-none text-slate-900"
            />
            <button
              onClick={() => {
                if (customUrl.trim()) {
                  onSelectLogo(customUrl.trim());
                  onClose();
                }
              }}
              disabled={!customUrl.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 block">Or Pick Preset Sample Logo</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_LOGOS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  onSelectLogo(sample.svg);
                  onClose();
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition ${
                  currentLogoUrl === sample.svg
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <img src={sample.svg} alt={sample.name} className="w-10 h-10 object-contain" />
                <span className="text-[11px] font-medium text-slate-700">{sample.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action footer */}
        {currentLogoUrl && (
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={() => {
                onSelectLogo('');
                onClose();
              }}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Remove Current Logo
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
