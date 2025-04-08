
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteButtonProps {
  selectedDocument: string;
  onDelete: () => void;
}

const DeleteDocumentButton: React.FC<DeleteButtonProps> = ({ selectedDocument, onDelete }) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      className="text-red-600 hover:text-red-800 hover:bg-red-50"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Delete Document
    </Button>
  );
};

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  documentName,
  onConfirm
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Document Permanently</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete "{documentName}"? This action cannot be undone and all associated data will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DeleteDocumentDialog = Object.assign(DeleteDocumentButton, {
  Confirmation: ConfirmationDialog
});

export default DeleteDocumentDialog;
