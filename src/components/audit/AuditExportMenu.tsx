
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
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
      toast.info(`Exporting audit logs as ${format.toUpperCase()}...`);
      exportAuditLogs(format);
      toast.success(`Audit logs exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="flex gap-2 items-center">
          <FileDown className="h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          PDF Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          CSV Spreadsheet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          JSON Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuditExportMenu;
