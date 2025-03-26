
import { GoogleService } from '../types';
import React from 'react';

export interface ServiceCardProps {
  serviceId: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isConnected: boolean;
  isConnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export interface AuthDialogProps {
  title: string;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onAuth: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export interface AnalysisDialogProps {
  serviceId: string;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedContent: string;
  setSelectedContent: (content: string) => void;
  isAnalyzing: boolean;
  analysisResult: string | null;
  onAnalyze: (e: React.FormEvent) => void;
}

export interface RealTimeMonitorProps {
  isRealTimeActive: boolean;
  lastUpdated: Date;
}

export interface ServiceCardActionsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onShowAnalysisDialog: () => void;
}
