
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, ExternalLink, Filter, Loader2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { RegulatoryUpdate, UpdateSeverity } from '@/utils/predictive/types';
import { fetchRegulatoryUpdates } from '@/utils/predictive/regulatoryUpdateService';
import { Industry } from '@/utils/types';

interface RegulatoryUpdatesFeedProps {
  industry?: Industry;
}

const RegulatoryUpdatesFeed: React.FC<RegulatoryUpdatesFeedProps> = ({ industry }) => {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<UpdateSeverity | 'all'>('all');

  useEffect(() => {
    const loadUpdates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUpdates = await fetchRegulatoryUpdates(industry);
        setUpdates(fetchedUpdates);
      } catch (err) {
        console.error('Error fetching regulatory updates:', err);
        setError('Failed to load regulatory updates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUpdates();
  }, [industry]);

  const getSeverityBadge = (severity: UpdateSeverity) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'important':
        return <Badge variant="default" className="bg-amber-500">Important</Badge>;
      case 'informational':
        return <Badge variant="outline">Informational</Badge>;
      default:
        return null;
    }
  };

  const filteredUpdates = filterSeverity === 'all' 
    ? updates 
    : updates.filter(update => update.severity === filterSeverity);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading regulatory updates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500 flex flex-col items-center">
        <AlertCircle className="h-6 w-6 mb-2" />
        <p>{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No regulatory updates found for {industry || 'your industry'}.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Latest regulatory updates relevant to {industry || 'your industry'}.
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            className="text-xs bg-background border rounded p-1"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as UpdateSeverity | 'all')}
          >
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="important">Important</option>
            <option value="informational">Informational</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredUpdates.map((update) => (
          <Card key={update.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{update.title}</h4>
                {getSeverityBadge(update.severity)}
              </div>
              
              <p className="text-sm text-slate-600 mb-3">{update.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                <Badge variant="outline" className="bg-slate-100">
                  {update.regulation}
                </Badge>
                {update.industry && (
                  <Badge variant="outline" className="bg-slate-100">
                    {update.industry}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Published: {formatDistanceToNow(new Date(update.publishDate))} ago</span>
                </div>
                
                {update.effectiveDate && (
                  <div>
                    Effective: {format(new Date(update.effectiveDate), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
              
              {update.source && (
                <div className="mt-3 pt-3 border-t text-xs">
                  <a 
                    href={update.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-primary"
                  >
                    Source: {update.source}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RegulatoryUpdatesFeed;
