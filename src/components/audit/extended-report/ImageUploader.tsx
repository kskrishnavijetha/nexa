
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageUpload: (imageBase64: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 500KB)
    if (file.size > 500 * 1024) {
      toast.error('Logo image must be less than 500KB');
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or SVG image');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewUrl(base64);
      onImageUpload(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload(null);
  };

  return (
    <div>
      {previewUrl ? (
        <div className="relative w-40 h-20 border rounded-md overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Logo Preview" 
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            asChild
          >
            <label htmlFor="logo-upload" className="cursor-pointer">
              <Upload size={16} />
              <span>Upload Logo</span>
              <input
                id="logo-upload"
                type="file"
                accept="image/jpeg,image/png,image/svg+xml"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </Button>
        </div>
      )}
    </div>
  );
};
