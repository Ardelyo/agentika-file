import React, { useRef, useState, useCallback } from 'react';
import { CompressionProfile } from '../types';
import DiamondIcon from './icons/DiamondIcon';
import ScaleIcon from './icons/ScaleIcon';
import ScissorsIcon from './icons/ScissorsIcon';

interface DropzoneProps {
  onProcessStart: (files: File[], profile: CompressionProfile) => void;
  disabled: boolean;
  isDesktop: boolean;
}

const ICONS: Record<CompressionProfile, React.ReactElement> = {
    [CompressionProfile.ARCHIVE]: <DiamondIcon className="w-5 h-5 mr-2" />,
    [CompressionProfile.BALANCED]: <ScaleIcon className="w-5 h-5 mr-2" />,
    [CompressionProfile.SUPER_SMALL]: <ScissorsIcon className="w-5 h-5 mr-2" />,
}

const ProfileButton = ({
  profile,
  label,
  selectedProfile,
  onClick,
}: {
  profile: CompressionProfile;
  label: string;
  selectedProfile: CompressionProfile;
  onClick: (profile: CompressionProfile) => void;
}) => {
  const isSelected = selectedProfile === profile;
  return (
    <button
      onClick={() => onClick(profile)}
      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 ${
        isSelected
          ? 'bg-cyan-400/20 text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
          : 'bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
      }`}
    >
      {ICONS[profile]}
      <span>{label}</span>
    </button>
  );
};


const Dropzone: React.FC<DropzoneProps> = ({ onProcessStart, disabled, isDesktop }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<CompressionProfile>(
    CompressionProfile.BALANCED
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onProcessStart(Array.from(e.target.files), selectedProfile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onProcessStart(Array.from(e.dataTransfer.files), selectedProfile);
      }
    },
    [onProcessStart, selectedProfile]
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 text-center">
      <div
        className="bg-[rgba(20,25,60,0.4)] backdrop-blur-2xl rounded-3xl p-8 border border-[rgba(0,255,255,0.2)] shadow-2xl shadow-cyan-500/10 transition-all duration-300"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
          Agentika File
        </h1>
        <p className="mt-3 mb-8 text-lg text-slate-400 max-w-xl mx-auto">
          Kompresi Cerdas Berbasis AI. Ukuran Minimal, Kualitas Maksimal.
        </p>
        
        <div className="mb-8">
            <div className="flex space-x-2 bg-slate-800/60 p-1 rounded-lg">
                <ProfileButton
                profile={CompressionProfile.ARCHIVE}
                label="Kualitas Arsip"
                selectedProfile={selectedProfile}
                onClick={setSelectedProfile}
                />
                <ProfileButton
                profile={CompressionProfile.BALANCED}
                label="Seimbang"
                selectedProfile={selectedProfile}
                onClick={setSelectedProfile}
                />
                <ProfileButton
                profile={CompressionProfile.SUPER_SMALL}
                label="Super Kecil"
                selectedProfile={selectedProfile}
                onClick={setSelectedProfile}
                />
            </div>
        </div>

        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`relative flex flex-col items-center justify-center w-full p-10 bg-slate-900/30 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer group hover:border-cyan-400 hover:bg-slate-900/50 ${
            isDragging ? 'border-cyan-400 bg-slate-900/50 scale-105' : 'border-slate-600'
            }`}
        >
            <div className="text-slate-400 group-hover:text-slate-300 transition-colors">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-500 group-hover:text-cyan-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" /></svg>
                <p className="font-semibold text-lg">{isDesktop ? 'Letakkan File Anda di Sini' : 'Letakkan File di Sini'}</p>
                <p className="text-sm">atau <span className="text-cyan-400 font-semibold">klik untuk memilih</span></p>
                 {isDesktop && <p className="text-xs mt-2 text-slate-500">(Bisa lebih dari satu file)</p>}
            </div>
            <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
            multiple={isDesktop}
            />
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
