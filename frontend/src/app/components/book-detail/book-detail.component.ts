// book-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book?: Book;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.loadBook();
  }

  private loadBook(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Aucun identifiant de livre fourni.';
      return;
    }

    this.loading = true;
    this.bookService.getBookById(+id)
      .pipe(
        catchError((err) => {
          console.error('Erreur lors du chargement du livre:', err);
          this.error = this.getErrorMessage(err);
          return of(null); // Permet de continuer l'Observable
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (book) => {
          if (book) {
            this.book = book;
          } else {
            this.error = 'Livre non trouvé.';
          }
        }
      });
  }

  private getErrorMessage(err: any): string {
    if (err.status === 404) {
      return 'Livre non trouvé dans la base de données.';
    }
    if (err.status === 0) {
      return 'Problème de connexion au serveur.';
    }
    return 'Une erreur inattendue est survenue lors du chargement du livre.';
  }

  editBook(): void {
    if (this.book?.id) {
      this.router.navigate(['/books/edit', this.book.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }

  deleteBook(): void {
    if (this.book?.id) {
      const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?');
      
      if (confirmDelete) {
        this.bookService.deleteBook(this.book.id).subscribe({
          next: () => {
            this.router.navigate(['/books']);
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du livre', err);
            alert('Impossible de supprimer le livre');
          }
        });
      }
    }
  }
}