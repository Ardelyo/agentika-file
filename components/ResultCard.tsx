import React from 'react';
import type { ProcessingState } from '../types';
import FileIcon from './icons/FileIcon';

interface ResultCardProps {
  state: ProcessingState;
  onCompare: () => void;
  onReset: () => void;
  onDownload: () => void;
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

const ResultCard: React.FC<ResultCardProps> = ({ state, onCompare, onReset, onDownload, isDesktop }) => {
  if (!state.originalFile || !state.optimizedFile || !state.plan || !state.successfulStrategy) {
    return null; // Should not happen if state is COMPLETE
  }

  const {
    originalFile,
    optimizedFile,
    plan,
    successfulStrategy,
    attemptCount,
    actualSavings
  } = state;

  const getSuccessMessage = () => {
    if (attemptCount === 1) {
      return `AI berhasil pada upaya pertama dengan strategi: ${successfulStrategy.strategy_name}.`;
    }
    return `Setelah ${attemptCount} upaya, AI berhasil memaksa pengecilan ukuran menggunakan strategi: ${successfulStrategy.strategy_name}.`;
  };

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
              {formatBytes(originalFile.size)} &rarr; <span className="font-semibold text-slate-300">{formatBytes(optimizedFile.size)}</span>
            </p>
          </div>
        </div>
        <div className="mt-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-center">
          <p className="text-sm font-medium text-cyan-300">Ukuran Berkurang</p>
          <p className="text-4xl font-bold text-cyan-400">{actualSavings.toFixed(1)}%</p>
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
        <h4 className="font-semibold text-slate-300">Strategi AI yang Berhasil:</h4>
        <div className="mt-2 text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg">
          <div>
            <p className="font-bold text-slate-300">
              {successfulStrategy.strategy_name} <span className="text-cyan-400">({successfulStrategy.tool})</span>
            </p>
            <p className="pl-4 italic text-slate-500">"{successfulStrategy.rationale}"</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={onDownload}
            className="w-full px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transition-all transform"
          >
            Unduh Hasil
          </button>
          <button
            onClick={onCompare}
            className="w-full px-6 py-3 bg-slate-700/50 text-slate-200 font-semibold rounded-full hover:bg-slate-700 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition-all transform"
          >
            Bandingkan Hasil
          </button>
          <button
            onClick={onReset}
            className="w-full px-6 py-2 text-slate-400 font-semibold rounded-full hover:bg-slate-800/50 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all transform"
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
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Optimasi Berhasil Dipaksakan!</h2>
        <p className="text-slate-400 mt-2">{getSuccessMessage()}</p>
      </div>
      <div
        className={`bg-[rgba(20,25,60,0.4)] backdrop-blur-2xl rounded-3xl shadow-2xl shadow-cyan-500/10 p-8 border border-[rgba(0,255,255,0.2)] items-start ${
          isDesktop ? 'grid md:grid-cols-2 gap-8' : 'flex flex-col gap-8'
        }`}
      >
        <MainContent />
      </div>
    </div>
  );
};

export default ResultCard;
