export type BookUpdate = {
  borrowed: boolean;
}

export type BookCreate = BookUpdate & {
  title: string;
  author: string;
  isbn: string;
}

export type Book = BookCreate & {
  id: string;
}
