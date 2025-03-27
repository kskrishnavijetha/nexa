
import { ReactNode } from 'react';

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  documentName: string;
  timestamp: string;
  user: string;
  status?: 'pending' | 'in-progress' | 'completed';
  comments?: Comment[];
  icon?: ReactNode;
}
