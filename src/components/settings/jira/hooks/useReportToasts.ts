
import { useToast } from '@/components/ui/use-toast';

export const useReportToasts = () => {
  const { toast } = useToast();

  const showGeneratingToast = () => {
    toast({
      title: "Generating report",
      description: "Please wait while we prepare your report...",
    });
  };

  const showSuccessToast = (reportType: string) => {
    toast({
      title: "Report generated",
      description: `Your ${reportType} report has been downloaded.`,
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error",
      description: "Failed to generate the report. Please try again.",
      variant: "destructive",
    });
  };

  return {
    showGeneratingToast,
    showSuccessToast,
    showErrorToast,
  };
};
