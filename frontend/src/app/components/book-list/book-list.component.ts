import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true, // Indique que ce composant est autonome
  imports: [CommonModule, NgIf, NgFor], // Ajouter HttpClientModule aux imports
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  totalPages = 0;
  currentPage = 1;
  loading = false;
  error: string | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(page = 1): void {
    this.loading = true;
    this.error = null;

    this.bookService.getBooks(page)
      .pipe(
        catchError(err => {
          this.error = 'Impossible de charger les livres. Veuillez réessayer.';
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.books = response.books;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
        }
        this.loading = false;
      });
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.loadBooks(page);
    }
  }

  editBook(book: Book): void {
    // Implémentez la logique pour modifier un livre
    console.log('Modifier le livre', book);
  }

  deleteBook(book: Book): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le livre "${book.title}" ?`)) {
      this.bookService.deleteBook(book.id!).subscribe(
        () => {
          this.books = this.books.filter(b => b.id !== book.id);
          this.totalPages = Math.ceil(this.books.length / 10);
          if (this.books.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadBooks(this.currentPage);
          }
        },
        err => {
          this.error = 'Impossible de supprimer le livre. Veuillez réessayer.';
        }
      );
    }
  }
}