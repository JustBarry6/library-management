// book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Book, BookListResponse, BookStatistics } from '../models/book.model';
import { SearchParams } from '../models/search-params.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly apiUrl = environment.apiUrl + '/books';

  constructor(private http: HttpClient) {}

  getBooks(page = 1, limit = 10): Observable<BookListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<BookListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book)
      .pipe(catchError(this.handleError));
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book)
      .pipe(catchError(this.handleError));
  }

  deleteBook(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  searchBooks(params: SearchParams): Observable<Book[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<Book[]>(`${this.apiUrl}/search`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  getStatistics(): Observable<BookStatistics> {
    return this.http.get<BookStatistics>(`${this.apiUrl}/statistics`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.status === 0) {
      // Erreur côté client ou problème réseau
      errorMessage = 'Problème de connexion au serveur';
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.error.message || error.message}`;
    }

    console.error('Une erreur est survenue:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}