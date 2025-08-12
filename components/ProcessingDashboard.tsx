import React, { useEffect, useRef, useState } from 'react';
import { type LogMessage } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';

interface ProcessingDashboardProps {
  logMessages: LogMessage[];
  fileName: string;
  isDesktop: boolean;
}

const getLogLineColor = (type: LogMessage['type']) => {
  switch (type) {
    case 'SYSTEM':
      return 'text-cyan-400';
    case 'CASCADE_STEP':
      return 'text-purple-400 font-bold';
    case 'AI':
      return 'text-slate-400 italic';
    case 'COMMAND':
      return 'text-yellow-400';
    case 'SUCCESS':
      return 'text-green-400';
    case 'FAILURE':
      return 'text-red-400';
    default:
      return 'text-slate-300';
  }
};

const getLogLinePrefix = (type: LogMessage['type']) => {
  switch (type) {
    case 'SYSTEM':
      return '[SYSTEM]';
    case 'CASCADE_STEP':
      return '[CASCADE]';
    case 'AI':
      return '[AI-RATIONALE]';
    case 'COMMAND':
      return '>';
    case 'SUCCESS':
        return '[SUCCESS]';
    case 'FAILURE':
        return '[FAILURE]';
    default:
      return '';
  }
};


const ProcessingDashboard: React.FC<ProcessingDashboardProps> = ({ logMessages, fileName, isDesktop }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);
    const [logVisible, setLogVisible] = useState(isDesktop);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logMessages]);

    const lastStep = logMessages.slice().reverse().find(m => m.type === 'CASCADE_STEP' || m.type === 'SYSTEM' || m.type === 'SUCCESS' || m.type === 'FAILURE');

  const renderFullLog = () => (
     <div 
        ref={logContainerRef}
        className="w-full h-64 bg-slate-900/70 rounded-xl p-4 font-mono text-sm overflow-y-auto border border-slate-700 transition-opacity duration-500"
      >
          {logMessages.map((msg) => (
              <div key={msg.id} className="flex">
                  <span className={`flex-shrink-0 mr-2 ${getLogLineColor(msg.type)}`}>{getLogLinePrefix(msg.type)}</span>
                  <p className={`whitespace-pre-wrap break-words ${getLogLineColor(msg.type)}`}>{msg.text}</p>
              </div>
          ))}
          <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full mt-2"></div>
      </div>
  )

  const renderMobileView = () => (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center bg-slate-900/50 p-8 rounded-xl h-48 border border-slate-700 text-center">
          <SpinnerIcon className="w-10 h-10 text-cyan-400 mb-4" />
          <p className="font-semibold text-lg text-slate-200">Sedang Memproses...</p>
          {lastStep && <p className="text-sm text-cyan-400 mt-2 animate-pulse">{lastStep.text}</p>}
      </div>

       <div className="mt-6 text-center">
        <button onClick={() => setLogVisible(!logVisible)} className="text-sm text-slate-400 hover:text-cyan-400">
            {logVisible ? 'Sembunyikan' : 'Tampilkan'} Log Teknis
        </button>
      </div>

      {logVisible && <div className="mt-4">{renderFullLog()}</div>}

    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-[rgba(13,17,39,0.8)] backdrop-blur-2xl rounded-3xl shadow-2xl shadow-cyan-500/10 p-8 border border-[rgba(0,255,255,0.2)]">
        <h2 className="text-2xl font-bold text-slate-100 text-center">Menjalankan Rencana AI...</h2>
        <p className="text-center text-slate-400 mt-2 truncate">{fileName}</p>
        
        <div className="my-8">
          {isDesktop ? renderFullLog() : renderMobileView()}
        </div>

        <div className="text-center text-slate-500 text-xs">
            AI sedang mengeksekusi "Iterative Reduction Cascade"...
        </div>
      </div>
    </div>
  );
};

export default ProcessingDashboard;
