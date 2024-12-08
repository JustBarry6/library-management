export interface SearchParams {
    [key: string]: string | number | undefined;
    title?: string;
    author?: string;
    category?: string;
    publishedYear?: number;
    isbn?: string;
  }