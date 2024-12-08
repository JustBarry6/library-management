import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Book, BookListResponse, BookStatistics } from '../models/book.model';
import { SearchParams } from '../models/search-params.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Configuration de l'URL de l'API
  private readonly apiUrl = environment.apiUrl + '/books';

  constructor(private http: HttpClient) {}

  // Récupérer tous les livres avec pagination
  getBooks(page = 1, limit = 10): Observable<BookListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<BookListResponse>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtenir un livre par son ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Créer un nouveau livre
  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour un livre
  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer un livre
  deleteBook(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Recherche avancée de livres
  searchBooks(params: SearchParams): Observable<Book[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<Book[]>(`${this.apiUrl}/search`, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtenir les statistiques des livres
  getStatistics(): Observable<BookStatistics> {
    return this.http.get<BookStatistics>(`${this.apiUrl}/statistics`).pipe(
      catchError(this.handleError)
    );
  }

  // Gestionnaire d'erreurs centralisé
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreurs côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreurs côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}