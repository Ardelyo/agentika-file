import React, { useState, useCallback, useEffect } from 'react';
import { FileStatus, type ProcessingState, type CascadeStrategy, CompressionProfile, LogMessage } from './types';
import Dropzone from './components/Dropzone';
import ProcessingDashboard from './components/ProcessingDashboard';
import ResultCard from './components/ResultCard';
import ComparisonModal from './components/ComparisonModal';
import UnsuccessfulResultCard from './components/UnsuccessfulResultCard';
import { getIterativeReductionPlan } from './services/geminiService';
import FileIcon from './components/icons/FileIcon';
import SpinnerIcon from './components/icons/SpinnerIcon';
import CheckIcon from './components/icons/CheckIcon';
import InfoIcon from './components/icons/InfoIcon';

// TypeScript declaration for the browser-image-compression library
declare const imageCompression: any;

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const useBreakpoint = (breakpoint = 1024) => {
    const [isMatch, setIsMatch] = useState(window.innerWidth >= breakpoint);

    useEffect(() => {
        const handleResize = () => setIsMatch(window.innerWidth >= breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMatch;
}

const App: React.FC = () => {
  const [processingStates, setProcessingStates] = useState<Record<string, ProcessingState>>({});
  const [fileOrder, setFileOrder] = useState<string[]>([]);
  const [activeFileId, setActiveFileId] =useState<string | null>(null);
  const [comparisonTargetId, setComparisonTargetId] = useState<string | null>(null);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  const isDesktop = useBreakpoint();
  
  const resetState = useCallback(() => {
    setProcessingStates({});
    setFileOrder([]);
    setActiveFileId(null);
    setComparisonTargetId(null);
    setIsProcessingQueue(false);
  }, []);
  
  const updateFileState = (id: string, updates: Partial<ProcessingState>) => {
      setProcessingStates(prev => ({
          ...prev,
          [id]: { ...prev[id], ...updates }
      }));
  };

  const addLog = (id: string, type: LogMessage['type'], text: string) => {
      setProcessingStates(prev => {
          const currentLogs = prev[id]?.logMessages || [];
          return {
              ...prev,
              [id]: { ...prev[id], logMessages: [...currentLogs, { id: currentLogs.length, type, text }] }
          };
      });
  };

  const processFile = async (fileId: string) => {
      const state = processingStates[fileId];
      if (!state) return;

      const { originalFile, profile } = state;
      updateFileState(fileId, { status: FileStatus.PROCESSING });

      try {
        addLog(fileId, 'SYSTEM', 'Initiating session with AI Compression Strategist...');
        await new Promise(r => setTimeout(r, 500));
        
        const plan = await getIterativeReductionPlan(originalFile.name, profile);
        updateFileState(fileId, { plan });

        addLog(fileId, 'SYSTEM', 'Initializing Iterative Reduction Cascade (IRC)...');
        addLog(fileId, 'AI', `Conceptual Quality Floor: ${plan.quality_floor_info}`);
        await new Promise(r => setTimeout(r, 1000));
        
        let success = false;
        let tempFile = originalFile;

        for (const [index, strategy] of plan.cascade.entries()) {
            addLog(fileId, 'CASCADE_STEP', `[UPAYA ${index + 1}/${plan.cascade.length}] Mencoba: ${strategy.strategy_name}`);
            await new Promise(r => setTimeout(r, 300));
            addLog(fileId, 'AI', `${strategy.rationale}`);
            await new Promise(r => setTimeout(r, 300));
            addLog(fileId, 'COMMAND', `${strategy.tool} ${JSON.stringify(strategy.parameters)}`);
            await new Promise(r => setTimeout(r, 500));
            
            const options: any = {
                maxSizeMB: originalFile.size / 1024 / 1024,
                useWebWorker: true,
            };

            if (strategy.parameters.quality) options.initialQuality = strategy.parameters.quality;
            if (strategy.parameters.format) options.fileType = `image/${strategy.parameters.format}`;
            if (strategy.parameters.resolution_scale && strategy.parameters.resolution_scale < 1.0) {
              const image = await imageCompression.getImageFromFile(originalFile);
              options.maxWidthOrHeight = Math.floor(Math.max(image.width, image.height) * strategy.parameters.resolution_scale);
              addLog(fileId, 'SYSTEM', `Resolusi diturunkan ke ${strategy.parameters.resolution_scale * 100}% (${options.maxWidthOrHeight}px maks)...`);
            }
            
            const compressedBlob = await imageCompression(originalFile, options);
            
            if (compressedBlob.size < originalFile.size) {
                addLog(fileId, 'SUCCESS', `BERHASIL! Ukuran output (${formatBytes(compressedBlob.size)}) lebih kecil dari asli (${formatBytes(originalFile.size)}).`);
                
                const originalName = originalFile.name.split('.').slice(0, -1).join('.') || originalFile.name;
                const newExtension = strategy.parameters.format || originalFile.name.split('.').pop() || 'jpg';
                const newFileName = `${originalName}-dioptimalkan.${newExtension}`;
                
                tempFile = new File([compressedBlob], newFileName, { type: compressedBlob.type });

                updateFileState(fileId, { successfulStrategy: strategy, attemptCount: index + 1 });
                success = true;
                break;
            } else {
                addLog(fileId, 'FAILURE', `GAGAL. Ukuran output tidak lebih kecil. Melanjutkan ke upaya berikutnya...`);
                await new Promise(r => setTimeout(r, 800));
            }
        }
        
        if (success) {
            const savings = ((originalFile.size - tempFile.size) / originalFile.size) * 100;
            updateFileState(fileId, {
                optimizedFile: tempFile,
                actualSavings: savings,
                status: FileStatus.COMPLETE,
            });
            addLog(fileId, 'SUCCESS', 'Strategi optimal ditemukan. Menyelesaikan proses...');
        } else {
            addLog(fileId, 'FAILURE', 'Semua strategi dalam cascade gagal mengurangi ukuran file.');
            updateFileState(fileId, { status: FileStatus.OPTIMIZATION_FAILED });
        }
      } catch (err) {
        console.error("Processing failed:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        updateFileState(fileId, { status: FileStatus.ERROR, error: errorMessage });
        addLog(fileId, 'FAILURE', `Processing failed: ${errorMessage}`);
      }
  };

  const handleProcessStart = (files: File[], profile: CompressionProfile) => {
      const newStates: Record<string, ProcessingState> = {};
      const newFileOrder: string[] = [];

      // On mobile, replace the queue. On desktop, add to it.
      if (!isDesktop) resetState();

      for (const file of files) {
          if (!file.type.startsWith('image/')) {
              alert("Maaf, aplikasi ini hanya dapat mengoptimalkan file gambar saat ini.");
              continue;
          }
          const id = `${file.name}-${file.lastModified}-${Math.random()}`;
          newStates[id] = {
              id, originalFile: file, profile, status: FileStatus.QUEUED,
              optimizedFile: null, logMessages: [], plan: null,
              successfulStrategy: null, attemptCount: 0, actualSavings: 0,
              error: null,
          };
          newFileOrder.push(id);
      }

      setProcessingStates(prev => ({ ...prev, ...newStates }));
      setFileOrder(prev => [...prev, ...newFileOrder]);

      if (!activeFileId || !isDesktop) {
          setActiveFileId(newFileOrder[0]);
      }

      // On mobile, start processing immediately
      if (!isDesktop && newFileOrder.length > 0) {
        processFile(newFileOrder[0]);
      }
  };
  
  const handleProcessQueue = async () => {
    setIsProcessingQueue(true);
    for (const id of fileOrder) {
      if (processingStates[id]?.status === FileStatus.QUEUED) {
        setActiveFileId(id);
        await processFile(id);
      }
    }
    setIsProcessingQueue(false);
  };

  const handleDownload = (fileId: string) => {
    const file = processingStates[fileId]?.optimizedFile;
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const activeState = activeFileId ? processingStates[activeFileId] : null;
  const comparisonState = comparisonTargetId ? processingStates[comparisonTargetId] : null;

  const renderWorkspaceContent = (state: ProcessingState | null) => {
    if (!state) {
        return <Dropzone onProcessStart={handleProcessStart} disabled={false} isDesktop={isDesktop} />;
    }
    
    switch (state.status) {
      case FileStatus.QUEUED:
      case FileStatus.PROCESSING:
        return <ProcessingDashboard logMessages={state.logMessages} fileName={state.originalFile.name} isDesktop={isDesktop} />;
      case FileStatus.COMPLETE:
        return <ResultCard 
            state={state}
            onCompare={() => setComparisonTargetId(state.id)}
            onReset={resetState}
            onDownload={() => handleDownload(state.id)}
            isDesktop={isDesktop}
          />;
      case FileStatus.OPTIMIZATION_FAILED:
        return <UnsuccessfulResultCard state={state} onReset={resetState} isDesktop={isDesktop}/>;
      case FileStatus.ERROR:
        return (
            <div className="w-full max-w-lg mx-auto p-8 text-center bg-[rgba(60,20,20,0.4)] backdrop-blur-2xl rounded-3xl shadow-2xl shadow-red-500/20 border border-red-500/30">
                <h2 className="text-2xl font-bold text-red-400">Terjadi Kesalahan</h2>
                <p className="mt-2 text-slate-300">{state.error}</p>
                <button onClick={resetState} className="mt-6 px-8 py-3 bg-red-500 text-white font-semibold rounded-full shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all transform hover:scale-105">
                    Coba Lagi
                </button>
            </div>
        );
      default:
        return null;
    }
  };

  const renderDesktopLayout = () => (
    <div className="flex w-full h-screen max-h-screen p-4 gap-4">
        {/* Left Panel: File Queue */}
        <div className="flex flex-col w-1/4 max-w-sm bg-[rgba(20,25,60,0.4)] backdrop-blur-xl rounded-2xl border border-[rgba(0,255,255,0.2)] p-4 shadow-xl">
           <h2 className="text-xl font-bold text-slate-200 mb-4 px-2">Antrian Proses</h2>
            <div className="flex-grow overflow-y-auto pr-2">
                {fileOrder.length === 0 && <p className="text-slate-500 text-sm text-center mt-8">Upload file untuk memulai.</p>}
                {fileOrder.map(id => {
                    const state = processingStates[id];
                    if (!state) return null;
                    const isActive = activeFileId === id;
                    const statusIcons = {
                        [FileStatus.QUEUED]: <div className="w-2 h-2 rounded-full bg-slate-500" title="Queued"></div>,
                        [FileStatus.PROCESSING]: <SpinnerIcon className="w-4 h-4 text-cyan-400" />,
                        [FileStatus.COMPLETE]: <CheckIcon className="w-4 h-4 text-green-400" />,
                        [FileStatus.OPTIMIZATION_FAILED]: <InfoIcon className="w-4 h-4 text-yellow-400" />,
                        [FileStatus.ERROR]: <div className="w-2 h-2 rounded-full bg-red-500" title="Error"></div>,
                    };

                    return (
                        <div key={id} onClick={() => setActiveFileId(id)}
                             className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 transition-colors ${isActive ? 'bg-cyan-400/20' : 'hover:bg-slate-700/50'}`}>
                            <FileIcon className="w-6 h-6 text-slate-400 mr-3 flex-shrink-0" />
                            <div className="flex-grow overflow-hidden">
                                <p className="text-sm font-medium text-slate-200 truncate">{state.originalFile.name}</p>
                                <p className="text-xs text-slate-400">{formatBytes(state.originalFile.size)}</p>
                            </div>
                            <div className="ml-3 flex-shrink-0">{statusIcons[state.status]}</div>
                        </div>
                    )
                })}
            </div>
            <div className="flex-shrink-0 pt-4 border-t border-slate-700/50">
                <button onClick={handleProcessQueue} disabled={isProcessingQueue}
                        className="w-full px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all">
                    {isProcessingQueue ? "Memproses..." : "Proses Semua"}
                </button>
            </div>
        </div>
        
        {/* Center Panel: Workspace */}
        <div className="flex-grow h-full overflow-y-auto">
            {renderWorkspaceContent(activeState)}
        </div>

        {/* Right Panel: AI Details */}
        <div className="flex flex-col w-1/4 max-w-sm bg-[rgba(20,25,60,0.4)] backdrop-blur-xl rounded-2xl border border-[rgba(0,255,255,0.2)] p-4 shadow-xl">
             <h2 className="text-xl font-bold text-slate-200 mb-4 px-2">Detail Strategi AI</h2>
             <div className="flex-grow overflow-y-auto bg-slate-900/50 rounded-lg p-3 text-xs font-mono text-slate-400">
                {activeState?.plan ? (
                    <pre className="whitespace-pre-wrap break-words">{JSON.stringify(activeState.plan, null, 2)}</pre>
                ) : (
                    <p className="text-slate-500 text-sm text-center mt-8">Pilih file untuk melihat rencana AI.</p>
                )}
             </div>
        </div>
    </div>
  );

  const renderMobileLayout = () => {
    const mobileState = fileOrder.length > 0 ? processingStates[fileOrder[0]] : null;
    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 bg-transparent">
             {renderWorkspaceContent(mobileState)}
        </main>
    );
  };

  return (
    <>
      {isDesktop ? renderDesktopLayout() : renderMobileLayout()}
      {comparisonState?.originalFile && comparisonState?.optimizedFile && (
        <ComparisonModal 
            isOpen={!!comparisonTargetId}
            onClose={() => setComparisonTargetId(null)}
            originalFile={comparisonState.originalFile}
            optimizedFile={comparisonState.optimizedFile}
        />
      )}
    </>
  );
};

export default App;