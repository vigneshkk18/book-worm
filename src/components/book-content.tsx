import { bookActions, useBook } from "@/hooks/use-book";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";

function hideControls() {
  bookActions.setControlsDisplay(false);
}

function BookContent() {
  const [, setRefresh] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const { book, loaded } = useBook();

  useEffect(() => {
    function triggerRefresh() {
      setRefresh(r => r + 1);
    }


    window.addEventListener("resize", triggerRefresh);
    window.addEventListener("orientationchange", triggerRefresh);

    return () => {
      window.addEventListener("resize", triggerRefresh);
      window.addEventListener("orientationchange", triggerRefresh);
    }
  }, []);

  if (!loaded || !book) return null;

  return (
    <div
      ref={parentRef}
      className={cn(
        "flex-1 h-full overflow-auto flex w-full justify-center p-4 my-1",
      )}
      onScroll={hideControls}
    >
      <Document file={book.src}>
        <Page
          width={window.innerWidth - (isMobile ? 30 : 100)}
          key={book.currentPage}
          pageNumber={book.currentPage}
          data-index={book.currentPage}
        />
      </Document>
    </div>
  );
}

export { BookContent };
