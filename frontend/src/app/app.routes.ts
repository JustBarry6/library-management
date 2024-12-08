import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' }, // Route par défaut
  { path: 'books', component: BookListComponent },
  { path: 'books/add', component: BookFormComponent },
  { path: 'books/edit/:id', component: BookFormComponent },
  { path: '**', redirectTo: '/books', pathMatch: 'full' } // Redirection pour les routes non trouvées
];