export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  dateAdded: string;
  lastRead: string | null;
}

export type BookActions = {
  setBook: (book: Partial<NonNullable<BookStore["book"]>>) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  goToPage: (by: number) => void;
  loadBook: (id: string) => void;
  jumpToPage: (page: number) => void;
  get canGoToPrevPage(): boolean;
  get canGoToNextPage(): boolean;
};
export type BookStore =
  | { loaded: false; book: null; showControls: boolean }
  | { loaded: true; book: Book & { src: string }; showControls: boolean };
