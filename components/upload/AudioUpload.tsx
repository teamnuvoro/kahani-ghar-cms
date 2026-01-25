"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadAudio } from "@/lib/utils/storage";
import { useToast } from "@/components/ui/use-toast";
import { Music, X } from "lucide-react";

interface AudioUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export function AudioUpload({
  value,
  onChange,
  label = "Audio File",
  required = false,
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(
    value ? "Audio file uploaded" : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Audio file must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      // Upload to Supabase
      const url = await uploadAudio(file);
      onChange(url);
      toast({
        title: "Upload successful",
        description: "Audio file uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload audio",
        variant: "destructive",
      });
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFileName(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="flex items-center gap-4">
        {fileName ? (
          <div className="flex items-center gap-2 p-3 border rounded-md bg-muted">
            <Music className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm flex-1 truncate">{fileName}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex-1 p-4 border-2 border-dashed rounded-md flex items-center justify-center">
            <Music className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <Input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            disabled={uploading}
            required={required && !fileName}
          />
          {uploading && (
            <p className="text-sm text-muted-foreground mt-1">Uploading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
