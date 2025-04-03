
import { useState } from 'react';
import { ScanResults } from '@/components/google/types';
import { Industry } from '@/utils/types';

export function useScanState() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [lastScanTime, setLastScanTime] = useState<Date | undefined>(undefined);
  const [itemsScanned, setItemsScanned] = useState<number>(0);
  const [violationsFound, setViolationsFound] = useState<number>(0);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | undefined>(undefined);

  const resetScanResults = () => {
    setScanResults(null);
  };

  return {
    isScanning,
    setIsScanning,
    scanResults,
    setScanResults,
    lastScanTime,
    setLastScanTime,
    itemsScanned,
    setItemsScanned,
    violationsFound,
    setViolationsFound,
    selectedIndustry,
    setSelectedIndustry,
    resetScanResults
  };
}
