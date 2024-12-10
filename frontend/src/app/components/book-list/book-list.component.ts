import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book, BookStatistics } from '../../models/book.model';
import { SearchParams } from '../../models/search-params.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  totalPages = 0;
  currentPage = 1;
  loading = false;
  error: string | null = null;
  statistics: BookStatistics | null = null;
  searchParams: SearchParams = {};

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadStatistics();
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

  loadStatistics(): void {
    this.loading = true;
    this.bookService.getStatistics()
      .pipe(
        catchError(err => {
          console.error('Erreur lors du chargement des statistiques:', err);
          this.error = `Erreur lors du chargement des statistiques: ${err.error?.message || err.message}`;
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(stats => {
        if (stats) {
          this.statistics = stats;
        }
      });
  }

  addBook(): void {
    this.router.navigate(['/books/add']);
  }

  editBook(book: Book): void {
    this.router.navigate(['/books/edit', book.id]);
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
          this.loadStatistics(); // Recharger les statistiques après suppression
        },
        err => {
          this.error = 'Impossible de supprimer le livre. Veuillez réessayer.';
        }
      );
    }
  }

  onSearch(): void {
    this.bookService.searchBooks(this.searchParams)
      .pipe(
        catchError(err => {
          this.error = 'Impossible de rechercher les livres. Veuillez réessayer.';
          return of([]);
        })
      )
      .subscribe(books => {
        this.books = books;
        this.loading = false;
      });
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.loadBooks(page);
    }
  }
}