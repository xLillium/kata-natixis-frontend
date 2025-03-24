import {Component, inject, output} from '@angular/core';
import {BooksService} from '../../../shared/services/books/books.service';
import {FormsModule} from '@angular/forms';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-book-search',
  imports: [
    FormsModule
  ],
  templateUrl: './book-search.component.html',
  standalone: true,
  styleUrl: './book-search.component.scss'
})
export class BookSearchComponent {
  isSearching = output<boolean>();
  title = '';
  author = '';
  private booksService = inject(BooksService);

  onSearch() {
    this.isSearching.emit(true);
    this.booksService.searchBooks(this.title, this.author)
      .pipe(finalize(() => this.isSearching.emit(false)))
      .subscribe();
  }

  onReset() {
    this.isSearching.emit(true);
    this.title = '';
    this.author = '';
    this.booksService.loadBooks()
      .pipe(finalize(() => this.isSearching.emit(false)))
      .subscribe();
  }

}
