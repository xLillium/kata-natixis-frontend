import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BooksListComponent} from './books-list.component';
import {BooksService} from '../../../shared/services/books/books.service';
import {Book} from '../../../shared/models/book.model';
import {signal, WritableSignal} from '@angular/core';
import {BookCardComponent} from '../book-card/book-card.component';
import {BookSearchComponent} from '../book-search/book-search.component';
import {NewBookComponent} from '../new-book/new-book.component';
import {of} from 'rxjs';

describe('BooksListComponent', () => {
  let component: BooksListComponent;
  let fixture: ComponentFixture<BooksListComponent>;
  let booksServiceSpy: jasmine.SpyObj<BooksService>;
  let booksSignal: WritableSignal<Book[]>;

  const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    author: 'Author',
    isbn: '1234567890',
    borrowed: false
  };


  beforeEach(async () => {
    booksSignal = signal<Book[]>([]) as WritableSignal<Book[]>;

    booksServiceSpy = jasmine.createSpyObj<BooksService>('BooksService', ['loadBooks', 'createBook']);
    (booksServiceSpy as any).loadedBooks = booksSignal;

    await TestBed.configureTestingModule({
      imports: [BooksListComponent, BookCardComponent, BookSearchComponent, NewBookComponent],
      providers: [{provide: BooksService, useValue: booksServiceSpy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;
    booksServiceSpy.loadBooks.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadBooks on init', () => {
    booksServiceSpy.loadBooks.and.returnValue(of([]));
    fixture.detectChanges();
    expect(booksServiceSpy.loadBooks).toHaveBeenCalled();
  });

  it('should show loading message when isLoading is true', () => {
    component['isLoading'].set(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Chargement des livres...');
  });

  it('should show book cards when books are loaded', () => {
    booksSignal.set([mockBook]);
    component['isLoading'].set(false);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-book-card');
    expect(cards.length).toBe(1);
  });

  it('should show "Aucun résultat." if no books are found', () => {
    booksSignal.set([]);
    component['isLoading'].set(false);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Aucun résultat.');
  });

  it('should show NewBookComponent when isAddingBook is true', () => {
    component.onStartAddBook();
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('app-new-book');
    expect(form).toBeTruthy();
  });

  it('should call createBook and close form on confirm', () => {
    const newBook = { title: 'New', author: 'A', isbn: '1234567890', borrowed: false };
    booksServiceSpy.createBook.and.returnValue(of({ ...newBook, id: '2' }));

    component.onStartAddBook();
    fixture.detectChanges();

    component.onConfirmAddBook(newBook);
    expect(booksServiceSpy.createBook).toHaveBeenCalledWith(newBook);
    expect(component.isAddingBook()).toBeFalse();
  });
});
