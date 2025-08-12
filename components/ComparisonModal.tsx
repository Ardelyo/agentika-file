import React, { useState, useEffect } from 'react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalFile: File;
  optimizedFile: File;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, originalFile, optimizedFile }) => {
  const [sliderValue, setSliderValue] = useState(50);
  const [originalImageSrc, setOriginalImageSrc] = useState<string>('');
  const [optimizedImageSrc, setOptimizedImageSrc] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !originalFile || !optimizedFile) return;

    const originalUrl = URL.createObjectURL(originalFile);
    const optimizedUrl = URL.createObjectURL(optimizedFile);
    setOriginalImageSrc(originalUrl);
    setOptimizedImageSrc(optimizedUrl);

    return () => {
      URL.revokeObjectURL(originalUrl);
      URL.revokeObjectURL(optimizedUrl);
    };
  }, [isOpen, originalFile, optimizedFile]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[rgba(13,17,39,0.7)] backdrop-blur-2xl rounded-3xl shadow-2xl shadow-cyan-500/10 w-full max-w-5xl max-h-[90vh] p-6 text-slate-200 flex flex-col overflow-hidden border border-[rgba(0,255,255,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">Perbandingan Visual</h2>
            <p className="text-sm text-slate-400">Geser untuk membandingkan</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl flex-grow bg-slate-900/50">
          {originalImageSrc && <img src={originalImageSrc} alt="Original" className="absolute inset-0 w-full h-full object-contain" />}
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">SEBELUM: {formatBytes(originalFile.size)}</div>
          
          {optimizedImageSrc && (
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}>
              <img src={optimizedImageSrc} alt="Compressed" className="w-full h-full object-contain" />
              <div className="absolute top-2 right-2 bg-cyan-500/80 text-black text-xs px-2 py-1 rounded-full font-bold">SESUDAH: {formatBytes(optimizedFile.size)}</div>
            </div>
          )}

          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onInput={(e) => setSliderValue(parseInt((e.target as HTMLInputElement).value, 10))}
            className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
            aria-label="Image comparison slider"
          />
          <div
            className="absolute top-0 bottom-0 bg-cyan-400 w-1 pointer-events-none"
            style={{ left: `calc(${sliderValue}% - 2px)`}}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 bg-slate-100 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-lg pointer-events-none">
                <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;