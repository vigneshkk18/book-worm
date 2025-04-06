import { Book } from "@/lib/types";
import { cacheFile, dataURLToBlob, removeFileFromCache } from "@/lib/utils";
import { useState } from "react";

function getBooks(): Book[] {
  return JSON.parse(localStorage.getItem("bw-books") || "[]");
}

function useBooks() {
  const [books, setBooks] = useState(getBooks);

  function addBook(book: Book, file: File, coverUrl: string) {
    const updatedBooks = books.concat(book);
    setBooks(updatedBooks);
    localStorage.setItem("bw-books", JSON.stringify(updatedBooks));
    cacheFile(file, `/books/get/${book.id}.pdf`);
    const blob = dataURLToBlob(coverUrl);

    cacheFile(
      new File([blob], "thumbnail.png", {
        type: blob.type,
      }),
      `/books/get/${book.id}/thumbnail.png`,
    );
  }

  function removeBook(id: string) {
    const updatedBooks = books.filter((b) => b.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem("bw-books", JSON.stringify(updatedBooks));
    removeFileFromCache(`/books/get/${id}.pdf`);
    removeFileFromCache(`/books/get/${id}/thumbnail.png`);
  }

  return { books, addBook, removeBook };
}

export { useBooks };
