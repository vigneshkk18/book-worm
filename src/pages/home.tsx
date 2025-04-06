import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/book-card";
import { AddBookDialog } from "@/components/add-book-dialog";
import { useBooks } from "@/hooks/use-books";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Home() {
  const { books, addBook, removeBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Library</h1>
        <div className="flex w-full md:w-auto gap-2 flex-col sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="pl-8 w-full rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-full cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </Button>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/10">
          <p className="text-xl text-muted-foreground">
            No books found. Add some books to your library!
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="mt-4 rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Book
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} removeBook={removeBook} />
          ))}
        </div>
      )}

      <AddBookDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddBook={addBook}
      />
    </div>
  );
}

export default Home;
