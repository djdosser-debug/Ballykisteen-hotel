import React, { useRef, useState } from 'react';
import { Upload, Link2, X, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';

interface PresetImage {
  label: string;
  url: string;
}

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  hint?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'avatar';
  presets?: PresetImage[];
  placeholderText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value = '',
  onChange,
  hint,
  aspectRatio = 'video',
  presets = [],
  placeholderText = 'No image selected'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Resize and compress image using Canvas to ensure it saves cleanly in localStorage
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP, SVG)');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            onChange(dataUrl);
            setUrlInput(dataUrl);
          } else {
            const rawUrl = event.target?.result as string;
            onChange(rawUrl);
            setUrlInput(rawUrl);
          }
        } catch {
          const rawUrl = event.target?.result as string;
          onChange(rawUrl);
          setUrlInput(rawUrl);
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
        setErrorMsg('Failed to process image file');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMsg('Failed to read file');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setIsUrlMode(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setErrorMsg(null);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'w-24 h-24 sm:w-28 sm:h-28';
      case 'avatar':
        return 'w-20 h-20 rounded-full';
      case 'wide':
        return 'w-full h-36';
      case 'video':
      default:
        return 'w-full sm:w-48 h-32';
    }
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-800">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {hint && <p className="text-[11px] text-slate-500 leading-tight">{hint}</p>}

      {/* Preview & Action Buttons Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        {/* Thumbnail Preview */}
        <div
          className={`relative shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center ${getAspectClass()}`}
        >
          {value ? (
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Image broken fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
              <span className="text-[10px] leading-tight text-slate-400">{placeholderText}</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-semibold animate-pulse">
              Processing...
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-[#14382c] text-white font-semibold text-xs hover:bg-[#1c4a3a] transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{value ? 'Upload New Photo' : 'Upload from Device'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUrlMode(!isUrlMode)}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-700 font-medium text-xs border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{isUrlMode ? 'Hide URL Box' : 'Paste Image URL'}</span>
            </button>
          </div>

          {/* Inline URL Input Box */}
          {isUrlMode && (
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="https://... image link"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
                className="flex-1 p-2 rounded-xl border border-slate-300 bg-white text-xs font-mono focus:border-[#14382c] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800"
              >
                Apply
              </button>
            </div>
          )}

          {/* Quick Presets (if provided) */}
          {presets.length > 0 && (
            <div className="pt-1">
              <div className="text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#c5a059]" />
                <span>Quick Resort Presets:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(preset.url);
                      setUrlInput(preset.url);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors border ${
                      value === preset.url
                        ? 'bg-[#14382c] text-[#c5a059] border-[#14382c] font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-1 text-[11px] text-red-600 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
