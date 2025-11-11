'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Loader2 } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';

interface SingleImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  endpoint?: 'roomImage' | 'galleryImage';
  aspectRatio?: 'square' | 'video' | 'auto';
}

export function SingleImageUpload({
  value,
  onChange,
  disabled = false,
  endpoint = 'roomImage',
  aspectRatio = 'auto',
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onChange(res[0].url);
        toast.success('Image uploaded successfully');
      }
      setUploading(false);
      setUploadProgress(0);
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled || acceptedFiles.length === 0) return;

      setUploading(true);
      try {
        await startUpload([acceptedFiles[0]]);
      } catch (error) {
        console.error('Upload error:', error);
        setUploading(false);
      }
    },
    [disabled, startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled: disabled || uploading,
  });

  const removeImage = () => {
    if (disabled) return;
    onChange(undefined);
    toast.success('Image removed');
  };

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto min-h-[200px]',
  }[aspectRatio];

  return (
    <div className="space-y-4">
      {value ? (
        <div
          className={cn(
            'relative rounded-lg overflow-hidden border bg-muted group',
            aspectRatioClass
          )}
        >
          <Image
            src={value}
            alt="Upload"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {!disabled && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
              >
                <X className="h-4 w-4 mr-2" />
                Remove Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            aspectRatioClass,
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50',
            (disabled || uploading) && 'opacity-50 cursor-not-allowed',
            uploading && 'pointer-events-none'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {isDragActive
                      ? 'Drop image here'
                      : 'Drag & drop an image here, or click to select'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG, WEBP up to 4MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
