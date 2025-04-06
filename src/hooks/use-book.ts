import { useSyncExternalStore } from "react";
import type { Book, BookStore, BookActions } from "@/lib/types";

let listeners = [] as any[];
let store = {
  loaded: false,
  book: {} as BookStore["book"],
  showControls: false,
} as BookStore;
let timer = null as any;

const bookStore = {
  subscribe(listener: any) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((li) => li !== listener);
    };
  },
  getSnapshot() {
    return store;
  },
};

export const bookActions: BookActions = {
  loadBook(id: string) {
    const localBook =
      (JSON.parse(localStorage.getItem("bw-books") || "[]") as Book[]).find(
        (b) => b.id === id,
      ) || null;
    if (!localBook || !store) return;

    store = {
      ...store,
      loaded: true,
      book: {
        ...store.book,
        ...localBook,
        src: `/books/get/${id}.pdf`,
      } as any,
    };
    emitChange();

    const ac = new AbortController();
    window.addEventListener(
      "click",
      () => {
        if (timer) clearTimeout(timer);
        
        store = { ...store, showControls: true };
        emitChange();

        timer = setTimeout(() => {
          store = {...store, showControls: false};
          emitChange();
        }, 2000);
      },
      { signal: ac.signal },
    );

    return () => ac.abort();
  },
  setBook(book) {
    store = {
      ...store,
      book: {
        ...store.book,
        ...book,
      } as any,
    };
    const books = (
      JSON.parse(localStorage.getItem("bw-books") || "[]") as Book[]
    ).map((b) =>
      store.loaded && b.id === store.book.id
        ? { ...b, ...book, lastRead: new Date().toISOString() }
        : b,
    );
    localStorage.setItem("bw-books", JSON.stringify(books));
    emitChange();
  },
  jumpToPage(page: number) {
    if (!store.loaded || Number.isNaN(+page)) return;
    bookActions.setBook({
      currentPage: Math.min(Math.max(1, page), store.book.totalPages),
    });
  },
  goToPage(by) {
    if (!store.loaded) return;
    bookActions.setBook({
      currentPage: store.book.currentPage + by,
    });
  },
  goToPrevPage() {
    if (!store.loaded || store.book.currentPage <= 0) return;
    bookActions.goToPage(-1);
  },
  goToNextPage() {
    if (!store.loaded || store.book.currentPage >= store.book.totalPages)
      return;
    bookActions.goToPage(+1);
  },
  setControlsDisplay(show: boolean) {
    store = {...store, showControls: show};
    emitChange();
  },
  get canGoToPrevPage() {
    return store.loaded && store.book.currentPage > 1;
  },
  get canGoToNextPage() {
    return store.loaded && store.book.currentPage < store.book.totalPages;
  },
};

function emitChange() {
  listeners.forEach((li) => li());
}

function useBook() {
  return useSyncExternalStore(bookStore.subscribe, bookStore.getSnapshot);
}

export { useBook };
