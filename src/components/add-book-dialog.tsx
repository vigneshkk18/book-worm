import type React from "react";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Book } from "@/lib/types";
import { pdfjs } from "react-pdf";
import { FileUp, Upload, RefreshCw, Check } from "lucide-react";

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBook: (book: Book, file: File, coverUrl: string) => void;
}

export function AddBookDialog({
  open,
  onOpenChange,
  onAddBook,
}: AddBookDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedMetadata, setExtractedMetadata] = useState<Partial<
    Book & { coverUrl: string }
  > | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>("/placeholder.svg");

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setIsProcessing(true);

      // Simulate metadata extraction with a delay
      setTimeout(async () => {
        const pdfInfo = await pdfjs.getDocument(await file.arrayBuffer())
          .promise;
        const metadata = (await pdfInfo.getMetadata()).metadata;
        const page = await pdfInfo.getPage(1);

        const viewport = page.getViewport({ scale: 1 }); // Adjust scale for desired resolution
        const canvas = canvasRef.current!;
        const canvasContext = canvas.getContext("2d")!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext,
          viewport,
        };

        await page.render(renderContext).promise;

        // Convert canvas to data URL (PNG format by default)
        const dataURL = canvas.toDataURL("image/png");

        const { author, title } = Object.entries(metadata.getAll()).reduce(
          (acc, [key, value]: any) => {
            if (key.includes("creator")) acc["author"] = value.toString();
            if (key.includes("title")) acc["title"] = value;
            return acc;
          },
          {} as Record<string, string>,
        );

        setExtractedMetadata({
          author,
          title,
          coverUrl: dataURL,
          totalPages: pdfInfo.numPages,
        });
        setCoverUrl(dataURL);
        setIsProcessing(false);
      }, 1500);
    }
  };

  const handleAddBook = async () => {
    if (!selectedFile) return;

    if (extractedMetadata) {
      const newBook: Book = {
        id: Date.now().toString(),
        currentPage: 1,
        dateAdded: new Date().toISOString(),
        lastRead: null,
        ...(extractedMetadata as any),
      };

      onAddBook(newBook, selectedFile!, extractedMetadata.coverUrl!);
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setExtractedMetadata(null);
    setIsProcessing(false);
    setCoverUrl("/placeholder.svg");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Book</DialogTitle>
        </DialogHeader>

        {!selectedFile ? (
          <div
            onClick={handleFileClick}
            className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors duration-200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
            <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Select a PDF file</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click to browse or drag and drop
            </p>
            <Button className="rounded-full">
              <Upload className="h-4 w-4 mr-2" /> Choose PDF
            </Button>
          </div>
        ) : isProcessing ? (
          <div className="text-center p-8">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Processing PDF</h3>
            <p className="text-sm text-muted-foreground">
              Extracting metadata from your file...
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="relative aspect-[2/3] w-full max-w-[180px] mb-3 overflow-hidden rounded-md border">
                <img
                  src={coverUrl || "/placeholder.svg"}
                  alt="Book cover"
                  className="object-cover h-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="font-medium text-lg">
                  {extractedMetadata?.title}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Author</Label>
                <p>{extractedMetadata?.author}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Pages</Label>
                <p>{extractedMetadata?.totalPages}</p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Metadata extracted from PDF file.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="rounded-full"
          >
            Cancel
          </Button>

          {extractedMetadata && (
            <Button
              type="button"
              onClick={handleAddBook}
              className="rounded-full"
            >
              <Check className="h-4 w-4 mr-2" /> Add to Library
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
