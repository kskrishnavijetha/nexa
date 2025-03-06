
import { ReactNode } from 'react';

export interface AuditEvent {
  id: string;
  action: string;
  documentName: string;
  timestamp: string;
  user: string;
  icon: ReactNode;
  comments?: Comment[];
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}
