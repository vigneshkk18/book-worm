import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "./ui/input";
import { bookActions, useBook } from "@/hooks/use-book";
import { useMobile } from "@/hooks/use-mobile";

function BookNav() {
  const { book, loaded, showControls } = useBook();
  const isMobile = useMobile();

  if (!loaded) return null;

  return (
    <div
      className={cn(
        "border-t w-full px-4 py-2 bg-background/95 backdrop-blur-sm z-10 transition-all duration-300 flex justify-between",
        isMobile && !showControls && "translate-y-full",
      )}
      style={{
          position: isMobile ? "fixed" : "relative",
          width: "100%",
          bottom: 0,
        }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={bookActions.goToPrevPage}
        disabled={!bookActions.canGoToPrevPage}
        className="rounded-full aspect-square"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2">
        <Input
          key={book.currentPage}
          type="number"
          className="w-16 text-center rounded-full"
          placeholder={book.currentPage.toString()}
          defaultValue={book.currentPage}
          min={1}
          max={book.totalPages}
          onChange={(e) => bookActions.jumpToPage(+e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            bookActions.jumpToPage(+(e.target as any).value)
          }
        />
        <span className="text-sm text-muted-foreground">
          of {book.totalPages}
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={bookActions.goToNextPage}
        disabled={!bookActions.canGoToNextPage}
        className="rounded-full aspect-square"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

export { BookNav };
