import { useBook } from "@/hooks/use-book";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

function BookContent() {
  const parentRef = useRef(null);
  const { book, loaded } = useBook();

  if (!loaded || !book) return null;

  return (
    <div
      ref={parentRef}
      className={cn(
        "flex-1 h-full overflow-auto flex w-full justify-center p-4 my-1",
      )}
    >
      <Document file={book.src}>
        <Page
          width={window.innerWidth - 100}
          key={book.currentPage}
          pageNumber={book.currentPage}
          data-index={book.currentPage}
        />
      </Document>
    </div>
  );
}

export { BookContent };
