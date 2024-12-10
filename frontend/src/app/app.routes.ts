import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/books', 
    pathMatch: 'full' 
  },
  { 
    path: 'books', 
    component: BookListComponent 
  },
  { 
    path: 'books/add', 
    component: BookFormComponent,
    title: 'Ajouter un livre'
  },
  { 
    path: 'books/edit/:id', 
    component: BookFormComponent,
    title: 'Modifier un livre'
  },
  { 
    path: '**', 
    redirectTo: '/books', 
    pathMatch: 'full' 
  }
];