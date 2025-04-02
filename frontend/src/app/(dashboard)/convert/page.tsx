"use client";

import { useState } from "react";
import { PdfUploader } from "@/components/pdf/pdf-uploader";
import { XmlViewer } from "@/components/xml/xml-viewer";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function ConvertPage() {
  const [isConverting, setIsConverting] = useState(false);
  const [xmlOutput, setXmlOutput] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUploadComplete = async (fileUrl: string, uploadedFileName: string) => {
    setIsConverting(true);
    setFileName(uploadedFileName);
    
    try {
      // Call our API to start the conversion
      const response = await fetch("/api/conversions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl,
          originalName: uploadedFileName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start conversion");
      }

      const data = await response.json();
      
      // Poll for conversion status
      await pollConversionStatus(data.id);
    } catch (error) {
      console.error("Error during conversion:", error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your PDF. Please try again.",
        variant: "destructive",
      });
      setIsConverting(false);
    }
  };

  const pollConversionStatus = async (conversionId: string) => {
    // Poll every 2 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/conversions/${conversionId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch conversion status");
        }
        
        const data = await response.json();
        
        if (data.status === "completed" && data.xmlOutput) {
          clearInterval(interval);
          setXmlOutput(data.xmlOutput);
          setIsConverting(false);
          toast({
            title: "Conversion complete",
            description: "Your PDF has been successfully converted to XML.",
          });
        } else if (data.status === "failed") {
          clearInterval(interval);
          setIsConverting(false);
          toast({
            title: "Conversion failed",
            description: "There was an error processing your PDF. Please try again.",
            variant: "destructive",
          });
        }
        // Continue polling if status is "pending" or "processing"
      } catch (error) {
        console.error("Error polling conversion status:", error);
        clearInterval(interval);
        setIsConverting(false);
        toast({
          title: "Error checking status",
          description: "Failed to check conversion status.",
          variant: "destructive",
        });
      }
    }, 2000);

    // Clean up interval if component unmounts
    return () => clearInterval(interval);
  };

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Convert PDF to XML</h1>
      <p className="text-muted-foreground">
        Upload a PDF file to convert it to XML format while preserving document structure.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <PdfUploader onUploadComplete={handleUploadComplete} />
        </div>
        <div>
          {isConverting ? (
            <Card className="w-full h-64 flex items-center justify-center">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-center text-muted-foreground">
                    Converting PDF to XML...
                    <br />
                    This may take a moment depending on file size and complexity.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : xmlOutput && fileName ? (
            <XmlViewer xml={xmlOutput} fileName={fileName} />
          ) : (
            <Card className="w-full h-64 flex items-center justify-center">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Icons.fileText className="h-8 w-8 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">
                    Upload a PDF to see the XML output here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}