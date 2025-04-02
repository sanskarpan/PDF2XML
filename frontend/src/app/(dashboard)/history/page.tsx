"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui//table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui//badge";
import Link from "next/link";

interface Conversion {
  id: string;
  originalName: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  fileUrl: string;
}

export default function HistoryPage() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const response = await fetch("/api/conversions");
        
        if (!response.ok) {
          throw new Error("Failed to fetch conversion history");
        }
        
        const data = await response.json();
        setConversions(data);
      } catch (error) {
        console.error("Error fetching conversion history:", error);
        toast({
          title: "Failed to load history",
          description: "Could not fetch your conversion history.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversions();
  }, [toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Conversion History</h1>
      <p className="text-muted-foreground">
        View and manage your PDF to XML conversion history.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Recent Conversions</CardTitle>
          <CardDescription>
            A list of all your PDF to XML conversions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : conversions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Icons.fileText className="h-12 w-12 text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                You haven&apos;t converted any PDFs yet.
              </p>
              <Button asChild>
                <Link href="/convert">Convert a PDF</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversions.map((conversion) => (
                    <TableRow key={conversion.id}>
                      <TableCell className="font-medium">
                        {conversion.originalName}
                      </TableCell>
                      <TableCell>
                        {formatDate(conversion.createdAt)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(conversion.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          disabled={conversion.status !== "completed"}
                        >
                          <Link href={`/conversions/${conversion.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}