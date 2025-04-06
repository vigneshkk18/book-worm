import type { Book } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

interface BookCardProps {
  book: Book;
  removeBook: (id: string) => void;
}

export function BookCard({ book, removeBook }: BookCardProps) {
  const progressPercentage = Math.round(
    (book.currentPage / book.totalPages) * 100,
  );

  // Format the last read date
  const lastReadDate = book.lastRead ? new Date(book.lastRead) : null;
  const formattedDate = lastReadDate
    ? `${lastReadDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })} at ${lastReadDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`
    : "Yet to read";

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg hover:translate-y-[-5px] cursor-pointer group border border-muted-foreground/10">
      <Button
        onClick={() => removeBook(book.id)}
        className="bg-red-500 hover:bg-red-600 absolute top-4 right-4 z-10"
      >
        <Trash className="h-5 w-5 text-white" />
      </Button>
      <Link href={`/books/${book.id}`}>
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={`/books/get/${book.id}/thumbnail.png`}
            alt={`Cover of ${book.title}`}
            className="h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-sm font-medium">Click to read</p>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {book.author}
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-muted" />
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
            Last read: {formattedDate}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
