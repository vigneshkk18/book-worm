import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useBook } from "@/hooks/use-book";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

function BookHeader() {
  const { theme, setTheme } = useTheme();
  const [, navigate] = useLocation();
  const { book, loaded, showControls } = useBook();

  if (!loaded) return null;

  return (
    <div
      className={cn(
        "flex fixed top-0 items-center justify-between px-4 py-2 border-b bg-background/95 backdrop-blur-sm z-10 transition-all duration-300 w-full",
        !showControls && "-translate-y-full",
      )}
    >
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mr-2 rounded-full aspect-square"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-medium truncate max-w-[200px] sm:max-w-md">
            {book.title}
          </h1>
          <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-md">
            {book.author}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full aspect-square"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

export { BookHeader };
