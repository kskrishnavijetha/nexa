
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuditTrail } from './AuditTrailProvider';
import { AuditExportFormat } from '@/utils/audit/exportUtils';
import { toast } from 'sonner';

interface AuditExportMenuProps {
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const AuditExportMenu: React.FC<AuditExportMenuProps> = ({ 
  label = 'Export Logs', 
  variant = 'outline',
  size = 'sm'
}) => {
  const { exportAuditLogs } = useAuditTrail();
  
  const handleExport = (format: AuditExportFormat) => {
    try {
      exportAuditLogs(format);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="flex gap-2 items-center">
          <Download className="h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          PDF Format
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          CSV Spreadsheet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          JSON Format
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuditExportMenu;
