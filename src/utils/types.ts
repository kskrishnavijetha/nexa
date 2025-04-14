
// Add any missing types or update existing ones

export type Industry = 
  | 'healthcare' 
  | 'finance' 
  | 'technology' 
  | 'retail' 
  | 'manufacturing' 
  | 'education'
  | 'government'
  | 'insurance'
  | 'telecommunications'
  | 'energy'
  | 'legal';

export type Region = 
  | 'us' 
  | 'eu' 
  | 'uk' 
  | 'canada' 
  | 'australia' 
  | 'global'
  | 'asia_pacific';

export type RiskSeverity = 'high' | 'medium' | 'low';

export interface ComplianceRisk {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  section: string;
  remediationSteps: string;
}

export interface ComplianceScores {
  overall: number;
  data: number;
  privacy: number;
  security: number;
  [key: string]: number;
}

export interface ComplianceReport {
  id: string;
  documentId?: string;
  documentName: string;
  uploadDate: string;
  industry: Industry;
  region: Region;
  frameworks?: string[];
  scores: ComplianceScores;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  userId?: string;
  risks?: ComplianceRisk[];
  gdprScore?: number;
  hipaaScore?: number;
  soc2Score?: number;
  pciDssScore?: number;
  overallScore?: number;
  industryScores?: Record<string, number>;
  regionScores?: Record<string, number>;
  isMultiFramework?: boolean;
  selectedFrameworks?: string[];
  frameworkScores?: Record<string, number>;
  regulations?: string[];
  pageCount?: number;
  originalFileName?: string;
  organization?: string;
}

export interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
  isProcessing: boolean;
}

export interface UploadActionsProps {
  onUpload: () => void;
  isDisabled: boolean;
}

export interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  disabled: boolean;
}

export interface IndustrySelectorProps {
  industry: Industry | null;
  setIndustry: (industry: Industry | null) => void;
  disabled: boolean;
}

export interface RegionSelectorProps {
  region: Region | null;
  setRegion: (region: Region | null) => void;
  disabled: boolean;
}
