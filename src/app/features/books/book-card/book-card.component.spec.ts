import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookCardComponent} from './book-card.component';
import {Book} from '../../../shared/models/book.model';
import {BooksService} from '../../../shared/services/books/books.service';
import {of} from 'rxjs';
import {signal} from '@angular/core';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;
  let booksServiceSpy: jasmine.SpyObj<BooksService>;

  const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    isbn: '123456789',
    borrowed: false
  };

  beforeEach(async () => {
    booksServiceSpy = jasmine.createSpyObj('BooksService', ['updateBookStatus']);

    TestBed.configureTestingModule({
      imports: [BookCardComponent],
      providers: [{provide: BooksService, useValue: booksServiceSpy}]
    });

    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'book', {
      get: () => signal(mockBook)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display book info', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Book');
    expect(compiled.textContent).toContain('Test Author');
    expect(compiled.textContent).toContain('123456789');
    expect(compiled.textContent).toContain('Disponible');
  });

  it('should call updateBookStatus when button is clicked', () => {
    booksServiceSpy.updateBookStatus.and.returnValue(of({...mockBook, borrowed: true}));

    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(booksServiceSpy.updateBookStatus).toHaveBeenCalledWith(mockBook);
  });
});
