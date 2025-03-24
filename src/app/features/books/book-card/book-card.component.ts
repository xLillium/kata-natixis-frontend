import {Component, inject, input} from '@angular/core';
import {Book} from '../../../shared/models/book.model';
import {BooksService} from '../../../shared/services/books/books.service';

@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.component.html',
  standalone: true,
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
  private booksService = inject(BooksService);

  book = input.required<Book>();

  onChangeBookStatus() {
    this.booksService.updateBookStatus(this.book()).subscribe();
  }
}
