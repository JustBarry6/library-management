// Interface de modèle de livre
export interface Book {
    id?: number;
    title: string;
    author: string;
    isbn?: string;
    publishedYear: number;
    category?: string;
    available?: boolean;
  }
  
  // Interface pour la réponse de liste paginée
  export interface BookListResponse {
    totalBooks: number;
    totalPages: number;
    currentPage: number;
    books: Book[];
  }
  
  // Interface pour les statistiques
  export interface BookStatistics {
    booksByCategory: { category: string; count: number }[];
    booksByYear: { year: number | string; count: number }[];
    booksAvailability: { available: boolean; count: number }[];
  }