import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {BooksService} from '../../../shared/services/books/books.service';
import {BookCardComponent} from '../book-card/book-card.component';
import {BookCreate} from '../../../shared/models/book.model';
import {NewBookComponent} from '../new-book/new-book.component';
import {BookSearchComponent} from '../book-search/book-search.component';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-books-list',
  imports: [
    BookCardComponent,
    NewBookComponent,
    BookSearchComponent
  ],
  templateUrl: './books-list.component.html',
  standalone: true,
  styleUrl: './books-list.component.scss'
})
export class BooksListComponent implements OnInit {
  isLoading = signal(false);
  isAddingBook = signal<boolean>(false);
  private booksService = inject(BooksService);
  books = this.booksService.loadedBooks;
  readonly hasBooks = computed(() => this.books().length > 0);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.booksService.loadBooks()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe();
  }

  onStartAddBook() {
    this.isAddingBook.set(true);
  }

  onCancelAddBook() {
    this.isAddingBook.set(false);
  }

  onConfirmAddBook($event: BookCreate) {
    this.booksService.createBook($event).subscribe({
      complete: () => this.isAddingBook.set(false)
    });
  }

  onSearchBook($event: boolean) {
    this.isLoading.set($event);
  }
}
