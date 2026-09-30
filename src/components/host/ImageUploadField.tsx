import React, { useRef, useState, useEffect } from 'react';
import { Upload, Link2, X, Image as ImageIcon, Sparkles, Check, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';

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
  const [urlInput, setUrlInput] = useState(value);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressInfo, setCompressInfo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imgLoadError, setImgLoadError] = useState(false);

  // Sync internal input state whenever parent value changes
  useEffect(() => {
    setUrlInput(value || '');
    setImgLoadError(false);
  }, [value]);

  /**
   * Intelligently compresses uploaded image so it comfortably fits
   * in Firestore (well under the 1MB document limit) and loads instantly on mobile.
   */
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          try {
            // Maximum target dimensions based on field type
            const maxDim = aspectRatio === 'avatar' || aspectRatio === 'square' ? 400 : 900;
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
            if (!ctx) {
              resolve(readerEvent.target?.result as string);
              return;
            }

            // Draw with smooth smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Progressive compression: target < 85 KB
            let quality = 0.75;
            let dataUrl = canvas.toDataURL('image/jpeg', quality);

            if (dataUrl.length > 120000) {
              quality = 0.65;
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
            if (dataUrl.length > 150000) {
              quality = 0.55;
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }

            const kbSize = Math.round((dataUrl.length * 3) / 4 / 1024);
            setCompressInfo(`${kbSize} KB · Cloud Optimized`);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPG, PNG, WebP, SVG)');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setImgLoadError(false);

    try {
      const compressedDataUrl = await compressImage(file);
      setUrlInput(compressedDataUrl);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMsg('Failed to process image. Please try another photo or paste a URL.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // Immediate update on URL change (typing or pasting)
  const handleUrlChange = (newUrl: string) => {
    setUrlInput(newUrl);
    setErrorMsg(null);
    setImgLoadError(false);
    setCompressInfo(null);
    onChange(newUrl.trim());
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image'))) {
        handleUrlChange(text.trim());
      } else {
        setErrorMsg('Clipboard does not contain a valid image URL');
      }
    } catch {
      // Clipboard permissions denied; user can paste manually
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setErrorMsg(null);
    setImgLoadError(false);
    setCompressInfo(null);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'w-24 h-24 sm:w-28 sm:h-28';
      case 'avatar':
        return 'w-20 h-20 rounded-full';
      case 'wide':
        return 'w-full sm:w-56 h-32 sm:h-36';
      case 'video':
      default:
        return 'w-full sm:w-48 h-32';
    }
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-800 flex items-center gap-1.5">
          <span>{label}</span>
          {value && !imgLoadError && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-full font-medium">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Active</span>
            </span>
          )}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 font-medium transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {hint && <p className="text-[11px] text-slate-500 leading-tight">{hint}</p>}

      {/* Main Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        {/* Live Thumbnail Preview */}
        <div
          className={`relative shrink-0 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-2xs flex items-center justify-center ${getAspectClass()}`}
        >
          {value && !imgLoadError ? (
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              onError={() => {
                setImgLoadError(true);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
              <span className="text-[10px] leading-tight text-slate-400">
                {imgLoadError ? 'Image URL Unreachable' : placeholderText}
              </span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-1">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Optimizing...</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2.5 w-full">
          {/* File Picker Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
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
              onClick={handlePasteClipboard}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-700 font-medium text-xs border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Paste image link from clipboard"
            >
              <Link2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Paste from Clipboard</span>
            </button>
          </div>

          {/* Direct URL Input Field (Always visible & live-synced) */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Or paste web image link (e.g. https://...)"
                value={urlInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                onBlur={() => onChange(urlInput.trim())}
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono focus:border-[#14382c] focus:outline-hidden text-slate-700 placeholder:text-slate-400 shadow-2xs"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {compressInfo && (
              <p className="text-[10px] text-emerald-700 font-medium pl-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{compressInfo}</span>
              </p>
            )}
          </div>

          {/* Quick Presets (if provided) */}
          {presets.length > 0 && (
            <div className="pt-0.5">
              <div className="text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#c5a059]" />
                <span>Resort Preset Photos:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUrlChange(preset.url)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors border ${
                      value === preset.url
                        ? 'bg-[#14382c] text-[#c5a059] border-[#14382c] font-semibold shadow-2xs'
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
            <div className="flex items-center gap-1 text-[11px] text-red-600 pt-0.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
