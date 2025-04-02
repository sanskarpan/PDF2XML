"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui//card";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui//use-toast";

interface PdfUploaderProps {
  onUploadComplete: (fileUrl: string, fileName: string) => void;
}

export function PdfUploader({ onUploadComplete }: PdfUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setProgress(100);
      
      if (res && res[0]) {
        toast({
          title: "Upload complete",
          description: "Your PDF has been uploaded successfully.",
        });
        onUploadComplete(res[0].fileUrl, file?.name || "Untitled.pdf");
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
    onUploadProgress: (progress) => {
      setProgress(progress);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    
    startUpload([file]);
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-xl">Upload PDF</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <div
                className={`border-2 border-dashed rounded-md p-8 text-center ${
                  file ? "border-primary" : "border-muted-foreground/25"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <Icons.file className="h-8 w-8 text-primary" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Icons.upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your PDF here or click to browse
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            {isUploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center">
                  Uploading... {progress.toFixed(0)}%
                </p>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </>
          ) : (
            "Upload and Convert"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
