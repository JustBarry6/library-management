import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode = false;
  bookId?: number;
  loading = false;
  error: string | null = null;
  submitted = false;
  currentYear = new Date().getFullYear(); // Ajout de cette propriété

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      publishedYear: [null, [
        Validators.required,
        Validators.min(1000),
        Validators.max(this.currentYear)
      ]],
      category: ['', [Validators.required]],
      isbn: [''],
      available: [true]
    });
  }

  // Getters
  get titleControl() { return this.bookForm.get('title'); }
  get authorControl() { return this.bookForm.get('author'); }
  get publishedYearControl() { return this.bookForm.get('publishedYear'); }
  get categoryControl() { return this.bookForm.get('category'); }
  get isbnControl() { return this.bookForm.get('isbn'); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookId = +id;
      this.loadBook(this.bookId);
    }
  }

  private loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue(book);
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.error = 'Erreur lors du chargement du livre';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.bookForm.valid) {
      this.loading = true;
      const book = this.bookForm.value;

      const action = this.isEditMode
        ? this.bookService.updateBook(this.bookId!, book)
        : this.bookService.createBook(book);

      action.subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error(error);
          this.error = 'Erreur lors de la sauvegarde du livre';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.bookForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }
}
