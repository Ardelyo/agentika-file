export enum FileStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  OPTIMIZATION_FAILED = 'OPTIMIZATION_FAILED',
}

export interface ProcessingState {
  id: string;
  originalFile: File;
  optimizedFile: File | null;
  logMessages: LogMessage[];
  plan: IterativeReductionPlan | null;
  successfulStrategy: CascadeStrategy | null;
  attemptCount: number;
  actualSavings: number;
  status: FileStatus;
  error: string | null;
  profile: CompressionProfile;
}

export interface LogMessage {
  id: number;
  type: 'SYSTEM' | 'AI' | 'COMMAND' | 'SUCCESS' | 'FAILURE' | 'CASCADE_STEP';
  text: string;
}

export enum CompressionProfile {
  ARCHIVE = 'Kualitas Arsip',
  BALANCED = 'Seimbang',
  SUPER_SMALL = 'Ukuran Super Kecil',
}

/**
 * Represents a single strategy within the Iterative Reduction Cascade.
 * Each strategy is a self-contained compression attempt.
 */
export interface CascadeStrategy {
  strategy_name: string;
  tool: string;
  parameters: {
    format?: 'jpeg' | 'webp' | 'avif';
    quality?: number;
    resolution_scale?: number; // e.g., 0.9 for 90%
  };
  rationale: string;
}

/**
 * The main plan returned by the AI, containing a ladder of strategies to attempt.
 */
export interface IterativeReductionPlan {
  quality_floor_info: string;
  planning_summary: {
    fileType: string;
    complexity: 'Sederhana' | 'Sedang' | 'Kompleks';
    visualFocus: 'Terdeteksi' | 'Tidak Terdeteksi';
    textureProfile: 'Halus' | 'Kasar' | 'Campuran';
  };
  cascade: CascadeStrategy[];
}
