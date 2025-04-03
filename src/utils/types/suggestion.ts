
export interface Suggestion {
  id?: string;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
}
