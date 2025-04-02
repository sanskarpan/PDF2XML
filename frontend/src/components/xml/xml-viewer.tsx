// frontend/src/components/xml/xml-viewer.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui//tabs";

interface XmlViewerProps {
  xml: string;
  fileName: string;
}

export function XmlViewer({ xml, fileName }: XmlViewerProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(xml);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "XML content has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy XML content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadXml = () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(".pdf", ".xml");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download started",
      description: `${fileName.replace(".pdf", ".xml")} is being downloaded.`,
    });
  };

  // Add syntax highlighting with simple formatting
  const formatXml = (xml: string) => {
    let formatted = xml
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/&lt;(\/?[a-zA-Z0-9_:-]+)(?:\s+[^&>]+)?&gt;/g, 
        "<span class='text-blue-500 dark:text-blue-400'>&lt;$1</span>$2<span class='text-blue-500 dark:text-blue-400'>&gt;</span>")
      .replace(/&lt;!\[CDATA\[(.*?)\]\]&gt;/g, 
        "<span class='text-gray-500'>&lt;![CDATA[$1]]&gt;</span>")
      .replace(/&lt;!--(.*?)--&gt;/g, 
        "<span class='text-gray-500'>&lt;!--$1--&gt;</span>");
    
    return formatted;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">XML Output</CardTitle>
      </CardHeader>
      <Tabs defaultValue="formatted">
        <div className="px-6">
          <TabsList>
            <TabsTrigger value="formatted">Formatted</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="formatted">
          <CardContent>
            <div className="relative">
              <div
                className="p-4 bg-muted rounded-md h-96 overflow-auto font-mono text-sm whitespace-pre"
                dangerouslySetInnerHTML={{ __html: formatXml(xml) }}
              />
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="raw">
          <CardContent>
            <div className="relative">
              <pre className="p-4 bg-muted rounded-md h-96 overflow-auto font-mono text-sm">
                {xml}
              </pre>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={copyToClipboard}>
          {copied ? (
            <>
              <Icons.check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Icons.fileText className="mr-2 h-4 w-4" />
              Copy XML
            </>
          )}
        </Button>
        <Button onClick={downloadXml}>
          <Icons.download className="mr-2 h-4 w-4" />
          Download XML
        </Button>
      </CardFooter>
    </Card>
  );
}