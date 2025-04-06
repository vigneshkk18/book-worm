import { useEffect } from "react";
import type { Book } from "@/lib/types";
import { useParams } from "wouter";
import { bookActions, useBook } from "@/hooks/use-book";
import { BookContent } from "@/components/book-content";
import { Dictionary } from "@/components/dictionary";
import { BookNav } from "@/components/book-nav";
import { BookHeader } from "@/components/book-header";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Book() {
  const { id } = useParams<{ id: string }>();
  const { book } = useBook();

  useEffect(() => {
    return bookActions.loadBook(id);
  }, [id]);

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-24 bg-muted rounded-md mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-muted/20">
      {/* Top navigation bar */}
      <BookHeader />
      {/* PDF content area */}
      <BookContent />
      <BookNav />
      <Dictionary />
    </div>
  );
}

export default Book;
