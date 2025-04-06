
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const RecentScans = () => {
  const navigate = useNavigate();

  // Mock data for recent scans
  const recentScans = [
    { id: 1, name: 'Privacy Policy.docx', date: '2025-04-02', score: 82 },
    { id: 2, name: 'GDPR Compliance.pdf', date: '2025-03-28', score: 76 },
    { id: 3, name: 'Terms of Service.pdf', date: '2025-03-25', score: 91 }
  ];

  return (
    <div className="space-y-4">
      {recentScans.map((scan) => (
        <div 
          key={scan.id}
          className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
          onClick={() => navigate(`/document-analysis?id=${scan.id}`)}
        >
          <div>
            <p className="font-medium">{scan.name}</p>
            <p className="text-sm text-muted-foreground">{scan.date}</p>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <span className={`font-medium ${
                scan.score >= 90 ? 'text-green-600' : 
                scan.score >= 75 ? 'text-amber-600' : 
                'text-red-600'
              }`}>
                {scan.score}%
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/document-analysis?id=${scan.id}`);
              }}
            >
              View
            </Button>
          </div>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={() => navigate('/history')}
      >
        View All Scans
      </Button>
    </div>
  );
};

export default RecentScans;
