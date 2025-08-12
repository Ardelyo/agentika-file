import React from 'react';
import type { ProcessingState } from '../types';
import FileIcon from './icons/FileIcon';
import InfoIcon from './icons/InfoIcon';

interface UnsuccessfulResultCardProps {
  state: ProcessingState;
  onReset: () => void;
  isDesktop: boolean;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const UnsuccessfulResultCard: React.FC<UnsuccessfulResultCardProps> = ({ state, onReset, isDesktop }) => {
  if (!state.originalFile || !state.plan) return null;
  const { originalFile, plan } = state;

  const rationale = `Setelah mengeksekusi cascade dari ${plan.cascade.length} strategi yang berbeda, AI kami menetapkan bahwa file Anda sudah sangat optimal. Tidak ada strategi yang berhasil memperkecil ukuran file tanpa merusak kualitasnya secara signifikan.`;
  
  const MainContent = () => (
    <>
      {/* Left/Top Column */}
      <div className="w-full">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 bg-slate-800 p-3 rounded-xl">
            <FileIcon className="h-8 w-8 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-200 truncate" title={originalFile.name}>{originalFile.name}</h3>
            <p className="text-sm text-slate-400">
              Ukuran Asli: <span className="font-semibold text-slate-300">{formatBytes(originalFile.size)}</span>
            </p>
          </div>
        </div>
        <div className="mt-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-center flex items-center justify-center space-x-3">
          <InfoIcon className="h-8 w-8 text-cyan-400" />
          <p className="text-xl font-bold text-cyan-300">File Sudah Optimal</p>
        </div>
        <div className="mt-4 grid grid-cols-3 text-center bg-slate-800/50 p-3 rounded-xl text-xs gap-2">
          <div>
            <p className="font-semibold text-slate-300">Kompleksitas</p>
            <p className="text-slate-400">{plan.planning_summary.complexity}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-300">Profil Tekstur</p>
            <p className="text-slate-400">{plan.planning_summary.textureProfile}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-300">Fokus Visual</p>
            <p className="text-slate-400">{plan.planning_summary.visualFocus}</p>
          </div>
        </div>
      </div>

      {/* Right/Bottom Column */}
      <div className="w-full">
        <h4 className="font-semibold text-slate-300">Penjelasan AI:</h4>
        <p className="mt-2 text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg">
          <span className="italic">"{rationale}"</span>
        </p>
        <div className="mt-6 flex flex-col space-y-3">
          <button
            disabled
            className="w-full px-6 py-3 bg-slate-700 text-slate-500 font-bold rounded-full shadow-inner cursor-not-allowed"
          >
            Unduh Hasil
          </button>
          <button
            disabled
            className="w-full px-6 py-3 bg-slate-800 text-slate-600 font-semibold rounded-full cursor-not-allowed"
          >
            Bandingkan Hasil
          </button>
          <button
            onClick={onReset}
            className="w-full px-6 py-2 text-cyan-400 font-semibold rounded-full hover:bg-cyan-400/10 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all transform"
          >
            Optimasi Lagi
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Tidak Dapat Dioptimalkan Lebih Lanjut</h2>
        <p className="text-slate-400 mt-2">AI telah mencoba semua strategi yang ada.</p>
      </div>
      <div className={`bg-[rgba(20,25,60,0.4)] backdrop-blur-2xl rounded-3xl shadow-2xl shadow-cyan-500/10 p-8 border border-[rgba(0,255,255,0.2)] items-center ${
          isDesktop ? 'grid md:grid-cols-2 gap-8' : 'flex flex-col gap-8'
        }`}
      >
        <MainContent />
      </div>
    </div>
  );
};

export default UnsuccessfulResultCard;
