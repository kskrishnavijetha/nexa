
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerificationMethod, Document } from './hooks/useHashVerification';

interface HashCompareSectionProps {
  compareMethod: VerificationMethod;
  setCompareMethod: (method: VerificationMethod) => void;
  pastedHash: string;
  setPastedHash: (hash: string) => void;
  selectedDocumentId: string;
  setSelectedDocumentId: (id: string) => void;
  recentDocuments: Document[];
  isLoading: boolean;
  computedHash: string;
  isVerifying: boolean;
  onVerify: () => void;
}

const HashCompareSection: React.FC<HashCompareSectionProps> = ({
  compareMethod,
  setCompareMethod,
  pastedHash,
  setPastedHash,
  selectedDocumentId,
  setSelectedDocumentId,
  recentDocuments,
  isLoading,
  computedHash,
  isVerifying,
  onVerify
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Compare Against</h2>
        
        <Tabs value={compareMethod} onValueChange={(v) => setCompareMethod(v as VerificationMethod)}>
          <TabsList className="mb-6">
            <TabsTrigger value="paste">Paste Known Hash</TabsTrigger>
            <TabsTrigger value="select">Select Document</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pasted-hash" className="mb-2 block">Expected Hash Value</Label>
                <Input
                  id="pasted-hash"
                  placeholder="Paste the expected SHA-256 hash here..."
                  className="font-mono text-sm"
                  value={pastedHash}
                  onChange={(e) => setPastedHash(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="select">
            <div className="space-y-4">
              <div>
                <Label htmlFor="document-select" className="mb-2 block">Select Recent Document</Label>
                <Select
                  value={selectedDocumentId}
                  onValueChange={setSelectedDocumentId}
                  disabled={isLoading || recentDocuments.length === 0}
                >
                  <SelectTrigger id="document-select">
                    <SelectValue placeholder="Select a document..." />
                  </SelectTrigger>
                  <SelectContent>
                    {recentDocuments.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name} ({doc.timestamp})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {recentDocuments.length === 0 && !isLoading && (
                  <p className="text-sm text-muted-foreground mt-2">No recent documents found</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={onVerify} 
            disabled={!computedHash || isVerifying || 
              (compareMethod === 'paste' && !pastedHash) || 
              (compareMethod === 'select' && !selectedDocumentId)
            }
            className="px-8"
          >
            Verify Document Integrity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HashCompareSection;
