import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {Book, BookCreate} from '../../models/book.model';
import {ErrorService} from '../error/errors.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

  private baseUrl = 'http://localhost:8080/api/books';

  private books = signal<Book[]>([])
  loadedBooks = this.books.asReadonly();


  searchBooks(title?: string, author?: string) {
    const params: Record<string, string> = {};
    if (title?.trim()) params['title'] = title.trim();
    if (author?.trim()) params['author'] = author.trim();

    return this.getBooks(params).pipe(
      tap((books) => this.books.set(books))
    );
  }

  loadBooks() {
    return this.searchBooks();
  }

  updateBookStatus(book: Book) {
    const newStatus = !book.borrowed;

    return this.patchBook(book.id, newStatus).pipe(
      tap(() => {
        this.updateBookInSignal({...book, borrowed: newStatus});
      })
    );
  }

  createBook(book: BookCreate) {
    return this.postBook(book).pipe(
      tap((createdBook) => {
        this.addBookToSignal(createdBook);
      })
    );
  }

  private updateBookInSignal(updatedBook: Book) {
    const updated = this.books().map(book =>
      book.id === updatedBook.id ? updatedBook : book
    );
    this.books.set(updated);
  }

  private addBookToSignal(newBook: Book) {
    this.books.set([...this.books(), newBook]);
  }

  private getBooks(params: Record<string, string> = {}): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.baseUrl, {params}).pipe(
      this.handleError<Book[]>()
    );
  }

  private patchBook(bookId: string, borrowed: boolean) {
    return this.httpClient.patch<Book>(this.baseUrl + '/' + bookId, {borrowed: borrowed})
      .pipe(
        this.handleError<Book>()
      );
  }

  private postBook(book: BookCreate) {
    return this.httpClient.post<Book>(this.baseUrl, book)
      .pipe(
        this.handleError<Book>()
      );
  }

  private handleError<T>(): (source: Observable<T>) => Observable<T> {
    return catchError((error: any) => {
      const rawMessage = error?.error?.message;
      let message = typeof rawMessage === 'string'
        ? rawMessage
        : 'Erreur inconnue.';
      const details = error?.error?.details?.map((d: any) => d.message) || [];
      this.errorService.show(message, details);
      return throwError(() => new Error(message));
    });
  }

}
